function parseKey(key) {
  return key.split('.').reduce((result, objectPart) => {
    let arrayParts = objectPart.match(/\[\d+\]/g);
    if (arrayParts) {
      const finalObjectPart = objectPart.substr(0, objectPart.indexOf('['));
      arrayParts = arrayParts.map(part => ({val: Number(part.slice(1, -1)), isArray: true}));
      return [...result, { val: finalObjectPart }, ...arrayParts];
    }
    return [...result, { val: objectPart }];
  }, []);
}

/**
 * Errors is a plain object like:
 * {
 *   ready_by: ["can't be blank"],
 *   photos: ["can't be blank"],
 *   food_preference_ids: "can't be blank",
 *   dishes[0].type: "must be correct type", // for nested attribute "dishes" with index 0, type field
 *   dishes[0].name: ["can't be blank"], // for nested attribute "dishes" with index 0, name field
 *   dishes[1].name: ["can't be blank"] // for nested attribute "dishes" with index 1, name field
 * }
 *
 *  This function converts it to:
 * {
 *   ready_by: ["can't be blank"],
 *   photos: ["can't be blank"],
 *   food_preference_ids: "can't be blank",
 *   dishes: [
 *     0: {
 *       type: "must be correct type",
 *       name: ["can't be blank"]
 *     },
 *     1: {
 *       name: ["can't be blank"]
 *     }
 *   ]
 * }
 */
export default function normalizeErrors(errors) {
  return Object.keys(errors).reduce((normalized, key) => {
    if (key.match(/\.|\[|\]/)) {
      const keyParts = parseKey(key);

      return (function normalizeParts(currentPart) {
        const currentKey = keyParts.shift();
        const children = keyParts.length === 0 ? errors[key] : normalizeParts(currentPart && currentPart[currentKey.val]);

        if (currentKey.isArray) {
          const newArray = currentPart || [];
          const lengthDiff = currentKey.val - newArray.length;
          newArray.push.apply(newArray, new Array(lengthDiff < 0 ? 0 : lengthDiff));
          newArray.splice(currentKey.val, 1, children);
          return newArray;
        } else { // eslint-disable-line no-else-return
          return { ...currentPart, [currentKey.val]: children };
        }
      })(normalized);
    }

    return {...normalized, [key]: errors[key]};
  }, {});
}
