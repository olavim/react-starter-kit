import React from 'react';
import ReactDOM from 'react-dom';

require('./styles/style.scss');

const MOUNT_NODE = document.getElementById('content');

if (__DEV__ && module.hot) {
	module.hot.accept();
}

ReactDOM.render(
	<h1>Hello World!</h1>,
	MOUNT_NODE
);