/**
 * Factory which contains endpoints for all the team stuff
 * 
 * NOT CURRENTLY USED. NEED TO REFACTOR CONTROLLER CODE TO USE THIS
 */
myezteam.factory('Teams', function($resouce) {
	return {
		$resource('', {}, 
			{
				findAsPlayer: {
					method: get,
					url: baseUrl + 'v1/teams',
					isArray: true
				}
			},
			{
				findAsOwner: {
					method: get,
					url: baseUrl + 'v1/teams/owner',
					isArray: true
				}
			},
			{
				findAsManager: {
					method: get,
					url: baseUrl + 'v1/teams/manages',
					isArray: true
				}
			},
			{
				find: {
					method: get,
					url: baseUrl + 'v1/teams/all'
				}
			},
			{
				findById: {
					method: get,
					url: baseUrl + 'v1/teams/:id'
				}
			},
			{
				findPlayers: {
					method: get,
					url: baseUrl + 'v1/teams/:id/players',
					isArray: true
				}
			},
			{
				save: {
					method: post,
					url: baseUrl + 'v1/teams'
				}
			},
			{
				update: {
					method: put,
					url: baseUrl + 'v1/teams'
				}
			},
			{
				delete: {
					method: delete,
					url: baseUrl + 'v1/teams/:id/owner'
				}
			},
			{
				findOwner: {
					method: get,
					url: baseUrl + 'v1/teams/:id/owner'
				}
			},
			{
				findManagers: {
					method: get,
					url: baseUrl + 'v1/teams/:id/managers',
					isArray: true
				}
			},
			{
				addManager: {
					method: post,
					url: baseUrl + 'v1/teams/:id/managers'
				}
			},
			{
				deleteManager: {
					method: delete,
					url: baseUrl + 'v1/teams/:id/managers/:user_id'
				}
			},
			{
				findDefaultEmails: {
					method: get,
					url: baseUrl + 'v1/teams/:id/default_emails',
					isArray: true
				}
			},
			{
				findEvents: {
					method: get,
					url: baseUrl + 'v1/teams/:id/events',
					isArray: true
				}
			},
			{
				findPastEvents: {
					method: get,
					url: baseUrl + 'v1/teams/:id/past_events',
					isArray: true
				}
			},
		)
	};
});