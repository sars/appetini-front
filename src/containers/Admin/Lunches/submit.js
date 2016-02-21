import normalizeErrors from 'helpers/normalizeErrors';
import moment from 'moment';

export default function submit(lunch, submitFn) {
  lunch.dishes_attributes = lunch.dishes;

  return new Promise((resolve, reject) => {
    submitFn(lunch).then(response => {
      resolve(response);
    }).catch(response => {
      const errors = normalizeErrors(response.errors);
      errors.photos_temp_image_ids = errors.photos;
      reject({...errors, _error: errors});
    });
  });
}
