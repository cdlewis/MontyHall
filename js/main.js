// Helper functions

function aRand( min, max )
{
	return Math.floor( Math.random() * ( 1 + max - min ) ) + min;
}

function shuffle(o){
for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
return o;
};

// Constants
var CAR = 'CAR';
var GOAT = 'GOAT';

var stage_combinations = [
	[ CAR, GOAT, GOAT ],
	[ GOAT, CAR, GOAT ],
	[ GOAT, GOAT, CAR ]
];

function montyhall( switch_door )
{
	var doors = stage_combinations[ aRand( 0, 2 ) ];
	var free_doors = shuffle( [ 0, 1, 2 ] );

	// Player guess
	var player_guess = free_doors.pop();

	// Do we switch doors?
	if( switch_door )
	{
		// Check which one to reveal
		var host_reveal = free_doors.pop();
		if( doors[ host_reveal ] == CAR )
		{
			free_doors.push( host_reveal );
			host_reveal == free_doors.shift();
		}

		// Switch doors and return outcome
		return ( doors[ free_doors.pop() ] == CAR );		
	}
	else
		return ( doors[ player_guess ] == CAR );
}

var NUMBER_OF_SIMULATIONS = 0;
var MAX_SIMULATIONS = 0;
var CORRECT_GUESSES = 0;
var SIMULATION_ID = 0;
var PROGRESS_ID = 0;
var SWITCH = true;

$( document ).ready( function() {
	$( "#start_test" ).click( function( event ) {
		event.preventDefault(); // prevent form submission
		$( "#start_test" ).attr( "disabled", "true" ); // prevent multiple clicks
		
		// Setup simulation variables
		NUMBER_OF_SIMULATIONS = 0;
		CORRECT_GUESSES = 0;
		SWITCH = $( "#switch" ).is( ":checked" );
		MAX_SIMULATIONS = parseInt( $( "#game_num" ).val() );
		if( MAX_SIMULATIONS == NaN ) // default to 10 games for invalid input
		{
			$( "#game_num" ).attr( "value", "10" );
			MAX_SIMULATIONS = 10;
		}
		
		// Start simulation
		SIMULATION_ID = setInterval( function() {
			NUMBER_OF_SIMULATIONS++;
			var outcome = montyhall( SWITCH );
			if( outcome == true )
				CORRECT_GUESSES++;

			if( NUMBER_OF_SIMULATIONS >= MAX_SIMULATIONS ) // end
			{
				$( "#results" ).append( "<tr><td>" + NUMBER_OF_SIMULATIONS + "</td><td>" + SWITCH.toString() + "</td><td>" + ( CORRECT_GUESSES / NUMBER_OF_SIMULATIONS * 100 ).toFixed( 0 ) + "%</td></tr>" );
				$( "#start_test" ).removeAttr( "disabled" ); // prevent multiple clicks
				clearInterval( SIMULATION_ID );
			}
		}, 1 );
		
		// Start monitoring
		$( "#progress_indicator" ).css( "display", "block" );
		PROGRESS_ID = setInterval( function() {
		console.log( 'progress' );
			if( NUMBER_OF_SIMULATIONS < MAX_SIMULATIONS )
				$( "#progress_bar" ).css( "width", ( NUMBER_OF_SIMULATIONS / MAX_SIMULATIONS * 100 ) + "%" );
			else
			{
				$( "#progress_indicator" ).css( "display", "none" );
				$( "#progress_bar" ).css( "width", "0%" );
				clearInterval( PROGRESS_ID );
			}
		}, 100 );
	} );
} );