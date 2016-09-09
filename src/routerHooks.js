import { setUser } from 'redux/modules/auth';
import { updateOrder } from 'redux/modules/purchase';
import { show as showToast, close as closeToast } from 'redux/modules/toast';

export default function hooks({dispatch, getState}, client) {
  return {
    userLoad: (nextState, replaceState, cb) => {
      const state = getState();
      const { user } = state.auth;
      if (!user) {
        const userFromToken = state.auth.tokenPayload && state.auth.tokenPayload.user;
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

    checkCurrentCook: ({params: { cookId }}, replaceState) => {
      const { user } = getState().auth;
      if (user && user.cook && user.cook.id !== parseInt(cookId, 10)) {
        replaceState(`/cooks/${user.cook.id}/draft_lunches`);
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
          dispatch(showToast('confirmations.success', 'accept', 'done'));
        }).catch(() => {
          dispatch(showToast('confirmations.error', 'cancel', 'error'));
        }).then(() => {
          // we need to close it manually , because toasts timeout works on component update only
          // In our case we render it on componentDidMount with active = true
          // so it never closes
          setTimeout(() => dispatch(closeToast()), 2000);
        });

        replaceState('/');
      }

      cb();
    },

    loadEditOrder: ({params: { orderId }}, replaceState, cb) => {
      if (__SERVER__) {
        cb();
        return;
      }
      client.get('/orders/' + orderId)
        .then(response => {
          const order = response.resource;
          if (order.payed || order.status !== 'pending') {
            dispatch(showToast('order.edit.deny', 'warning', 'error'));
            setTimeout(() => dispatch(closeToast()), 2000);
            replaceState('/');
          } else {
            dispatch(updateOrder(order));
            replaceState('/checkout');
          }
          cb();
        })
        .catch((response) => {
          dispatch(showToast(response.errors, 'cancel', 'error'));
          setTimeout(() => dispatch(closeToast()), 2000);
          replaceState('/');
          cb();
        });
    }
  };
}
