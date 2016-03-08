import { setUser } from 'redux/modules/auth';
import { show as showToast, close as closeToast } from 'redux/modules/toast';

export default function hooks({dispatch, getState}, client) {
  return {
    userLoad: (nextState, replaceState, cb) => {
      const state = getState();
      const { user } = state.auth;
      if (!user) {
        const userFromToken = state.auth.tokenPayload.user;
        if (userFromToken) {
          client.get('/users/' + userFromToken.id).then(result => {
            dispatch(setUser(result.resource));
            cb();
          }).catch(() => {
            cb();
          });
          return;
        }
      }
      cb();
    },

    requireLogin: (nextState) => {
      const { user } = getState().auth;

      if (__SERVER__ && !user) {
        nextState.location.state = {...nextState.location.state, responseStatus: 403};
      }
    },

    confirmEmail: ({params: { token }}, replaceState, cb) => {
      // We cannot leave this logic on server because server will send redirect to client and then client
      // will request new page and will know nothing about toasts, whether confirmation has been
      // successfully completed or not.
      if (__CLIENT__) {
        client.get('/confirmation', {
          params: {
            confirmation_token: token
          }
        }).then(() => {
          dispatch(showToast('Письмо с подтверждением email отправлено на почту', 'accept', 'done'));
        }).catch(() => {
          dispatch(showToast('Вероятно, неверный или устаревший токен', 'cancel', 'error'));
        }).then(() => {
          // we need to close it manually , because toasts timeout works on component update only
          // In our case we render it on componentDidMount with active = true
          // so it never closes
          setTimeout(() => dispatch(closeToast()), 2000);
        });

        replaceState('/');
      }

      cb();
    }
  };
}
