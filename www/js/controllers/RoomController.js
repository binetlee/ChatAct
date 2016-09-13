(function(){
	angular.module('starter')
	.controller('RoomController', ['$scope', '$state', 'localStorageService', 'SocketService', 'moment', '$ionicScrollDelegate', RoomController]);
	
	function RoomController($scope, $state, localStorageService, SocketService, moment, $ionicScrollDelegate){

		var me = this;

		//array for messages sent within the current room
		me.messages = [];

		//use moment.js library to create a timestamp, indicating when the last message was sent
		$scope.humanize = function(timestamp){
			return moment(timestamp).fromNow();
		};

		//get current room and user from localstorage
		me.current_room = localStorageService.get('room');
		
		var current_user = localStorageService.get('username');

		//if user is not current, determine status and following messages
		$scope.isNotCurrentUser = function(user){
			
			if(current_user != user){
				return 'not-current-user';
			}
			return 'current-user';
		};


		//tied to send button
		//send: user, text, time given current room
		$scope.sendTextMessage = function(){

			var msg = {
				'room': me.current_room,
				'user': current_user,
				'text': me.message,
				'time': moment()
			};

			//push message into message array			
			me.messages.push(msg);
			//scroll to bottom after message
			$ionicScrollDelegate.scrollBottom();

			//clear message value for next message, then send message
			me.message = '';
			
			SocketService.emit('send:message', msg);
		};

		//function that runs when user leaves the room
		$scope.leaveRoom = function(){
	
			var msg = {
				'user': current_user,
				'room': me.current_room,
				'time': moment()
			};

			//message for server
			SocketService.emit('leave:room', msg);
			//return to rooms page
			$state.go('rooms');

		};

		//message left behind for other users within the room upon departure
		SocketService.on('message', function(msg){
			me.messages.push(msg);
			$ionicScrollDelegate.scrollBottom();
		});


	}

})();