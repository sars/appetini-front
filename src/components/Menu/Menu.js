import { Menu } from 'react-toolbox/lib/menu';

export default class extends Menu {
  componentDidMount() {
    setTimeout(() => {
      super.componentDidMount();
    }, 0);
  }
}
