import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Tasks',
    icon: 'Square',
    component: Home,
    path: '/'
  }
};

export const routeArray = Object.values(routes);