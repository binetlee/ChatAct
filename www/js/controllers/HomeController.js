(function(){
	angular.module('starter')
	.controller('HomeController', ['$scope', '$state', 'localStorageService', 'SocketService', HomeController]);
	
	function HomeController($scope, $state, localStorageService, SocketService){

		var me = this;

		//get current room, have a list of rooms for display in rooms array
		me.current_room = localStorageService.get('room');
		me.rooms = ['Baseball - Plano', 'Poetry - Richardson', 'Development', 'Group Gathering', 'University of Dallas', 'Austin Sports'];
		
		//login function, where username input is saved as username throughout
		$scope.login = function(username){
			localStorageService.set('username', username);
			$state.go('rooms');
		};

		//Redirect into selected room
		//save current room
		//join:room sent through socket with current room
		$scope.enterRoom = function(room_name){

			me.current_room = room_name;
			localStorageService.set('room', room_name);
			
			var room = {
				'room_name': room_name
			};

			SocketService.emit('join:room', room);

			$state.go('room');
		};

	}

})();