import React from 'react';

import Sidebar from '../../components/sidebar';

//This is a view layout, hence avoid putting any business logic
export default class Home extends React.Component {
	render () {
		return <Sidebar></Sidebar>
	}
}