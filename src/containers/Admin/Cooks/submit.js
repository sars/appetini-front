import normalizeErrors from 'helpers/normalizeErrors';

export default function submit(cook, submitFn) {
  cook.user_attributes = cook.user;
  cook.user_attributes.name = cook.first_name + ' ' + cook.last_name;
  return new Promise((resolve, reject) => {
    submitFn(cook).then(response => {
      resolve(response);
    }).catch(response => {
      const errors = normalizeErrors(response.errors);
      reject({...errors, _error: errors});
    });
  });
}
