/**
 * Factory which contains endpoints for all the event stuff
 * 
 * NOT CURRENTLY USED. NEED TO REFACTOR CONTROLLER CODE TO USE THIS
 */
myezteam.factory('Events', function($resouce) {
	
	return $resource(baseUrl + 'v1/events', {}, 
			{
				rsvp: {
					method: post,
					url: baseUrl + 'v1/responses'
				}
			}
		);
		
});