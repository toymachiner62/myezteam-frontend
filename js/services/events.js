/**
 * Factory which contains endpoints for all the event stuff
 */
myezteam.factory('Events', function($resource) {
	
	return $resource(baseUrl + 'v1/events/:id', {id: '@id'}, 
			{
				rsvp: {
					method: 'post',
					url: baseUrl + 'v1/responses' + apiKey
				}
			}
		);
		
});