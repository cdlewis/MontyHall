// Helper functions

function aRand( min, max )
{
	return Math.floor( Math.random() * ( 1 + max - min ) ) + min;
}

function shuffle( o )
{
	for( var j, x, i = o.length; i; j = Math.floor( Math.random() * i ), x = o[ --i ], o[ i ] = o[ j ], o[ j ] = x );
	return o;
};

String.prototype.format = function() {
	var args = arguments;
	return this.replace( /{(\d+)}/g, function( match, number )
	{ 
		return typeof args[number] != 'undefined' ? args[number] : match;
	} );
};

// Constants

var CAR = 'CAR';
var GOAT = 'GOAT';

var stage_combinations = [
	[ CAR, GOAT, GOAT ],
	[ GOAT, CAR, GOAT ],
	[ GOAT, GOAT, CAR ]
];

// Game

function montyhall( switch_door )
{
	var doors = stage_combinations[ aRand( 0, 2 ) ];
	var free_doors = shuffle( [ 0, 1, 2 ] );

	var player_guess = free_doors.pop();

	if( switch_door )
	{
		// Reveal the first remaining door unless it's the car
		var host_reveal = free_doors.pop();
		if( doors[ host_reveal ] == CAR )
		{
			free_doors.push( host_reveal );
			host_reveal == free_doors.shift();
		}

		// Change player guess to the final remaining door
		return ( doors[ free_doors.pop() ] == CAR );		
	}
	else
		return ( doors[ player_guess ] == CAR );
}

// UI

$( document ).ready( function() {
	$( "#start_test" ).click( function( event ) {
		event.preventDefault(); // prevent form submission
		$( "#start_test" ).attr( "disabled", "true" ); // prevent multiple clicks
		
		// Setup simulation variables
		correct_guesses = 0;
		switch_door = $( "#switch" ).is( ":checked" );
		max_games = parseInt( $( "#game_num" ).val() );
		if( max_games == NaN ) // default to 10 games for invalid input
		{
			$( "#game_num" ).attr( "value", "10" );
			max_games = 10;
		}
		num_games = 0;
		
		// Start simulation
		SIMULATION_ID = setInterval( function() {
			if( montyhall( switch_door ) )
				correct_guesses++;

			if( ++num_games > max_games ) // end
			{
				// add results to table
				$( "#results" ).append( "<tr><td>{0}</td><td>{1}</td><td>{2}%</td></tr>".format(
					max_games,
					switch_door.toString(),
					( correct_guesses / max_games * 100 ).toFixed( 2 )
				) );
				
				// clean up
				$( "#start_test" ).removeAttr( "disabled" );
				clearInterval( SIMULATION_ID );
			}
		}, 1 );
		
		// Start monitoring
		$( "#progress_indicator" ).css( "display", "block" );
		PROGRESS_ID = setInterval( function() {
			if( num_games < max_games )
				$( "#progress_bar" ).css( "width", ( num_games / max_games * 100 ) + "%" );
			else
			{
				// clean up
				$( "#progress_indicator" ).css( "display", "none" );
				$( "#progress_bar" ).css( "width", "0%" );
				clearInterval( PROGRESS_ID );
			}
		}, 100 );
	} );
} );