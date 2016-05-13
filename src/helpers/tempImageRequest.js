export function tempImageRequest(client, file) {
  return client.post('/temp_images', { attach: {'resource[image]': file} }).then(responce => {
    return responce.resource;
  }).catch(() => {throw 'Ошибка при добавлении картинки';}); // eslint-disable-line no-throw-literal
}
