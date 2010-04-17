/*
 * This file is a part of Total Recall, the flash card webapp.
 * Copyright Brady Bouchard 2010.
 * Available at: http://github.com/brady8/total-recall
 * See the README (README.markdown) for more information.
 */

$(function() {

	var index; // Current card displayed.
	var cards_left_today; // Number of cards left to study today.
	var cards_unlearned; // Cards with an EF < 4.0.
	var $db; // The database (stores easiness factor and next study date).
	var progress; // Progress (percentage) for today.

	// Internet Explorer is a piece of shit.
	if(!Array.indexOf) {
		Array.prototype.indexOf = function(obj) {
			for(var i=0; i<this.length; i++) {
				if(this[i] === obj) {
					return i;
				}
			}
			return -1;
		}
	}

	function start_it_up() {
		// Are we in 'study' mode?
		if ($('#question-content').length != 0) {
			// We might just have an empty file!
			if (typeof($fc) == 'undefined') {
				$('#question-content').html('This CSV file is empty!');
				show_edit_button();
			} else {
				$(document).keypress(function(e) {
					switch(e.which) {
						case 32: $('#show-answer').click(); return false; break;
						case 106: $('#1').click(); return false; break;
						case 107: $('#2').click(); return false; break;
						case 108: $('#3').click(); return false; break;
						case 59: $('#5').click(); return false; break;
					}
				});
				load_data();
				populate_cards_for_today();
				load_next_card();
				store_data();
				show_reset_button();
			}
		}
	}

	function show_edit_button() {
		$('#edit-question').show();
		$('#edit-question').click(function() {
			window.location = 'edit.php?set=' + $set_name + '&index=' + (typeof(index) == 'undefined' ? '0' : index);
			return false;
		});
	}

	function show_reset_button() {
		$('#reset-database').show();
		$('#reset-database').click(function() {
			$.setItem($set_name, null);
			$.setItem($set_name + '_card_counts', null);
			$.setItem($set_name + '_date', null);
			$db = null;
			start_it_up();
			return false;
		});
	}

	function load_next_card() {
		if (typeof $start_index != 'undefined' && $start_index != null) {
			index = parseInt($start_index);
			index = isNaN(index) ? select_next_card() : index;
			if (index >= $fc.length) { index = $fc.length - 1; }
			$start_index = null;
		} else {
			index = select_next_card();
		}
		update_progress_bar();
		show_edit_button();
		$('#question-content').html($fc[index][0]);
		$('#answer-content').html($fc[index][1]);
		$('#answer-box').hide();
		$('#question-box').show();
		parse_with_fancybox();
	}

	// Any images in the question/answer pairs are removed,
	// and replaced with links that use Fancybox.
	// Only occurs if there is a 'alt' or 'title' attribute set.
	function parse_with_fancybox() {
		if ($('a.fancybox').length > 0) {
			$('a.fancybox > img').each(function() {
				var link_title = $(this).attr('alt') || $(this).attr('title');
				if (typeof link_title != 'undefined') {
					var parent = $(this).parent();
					$(this).hide();
					parent.attr('title', link_title);
					parent.html('image: &#8220;' + link_title + '&#8221;');
				}
			});
			$('a.fancybox').fancybox({
				'hideOnContentClick': true,
				'showCloseButton' : false,
				'speedIn' : 0,
				'speedOut' : 0,
				'overlayColor' : '#000'
			});
		}
	}

	$('#show-answer').click(function() {
		if($('#answer-box').css('display') == 'none') {
			$('#question-box').hide();
			$('#answer-box').show();
			parse_with_fancybox();
		}
		return false;
	});

	$('.scorebutton').click(function() {
		if($('#answer-box').css('display') == 'none') { return false; }
		$('#answer-box').hide();
		save_card_data(this.id);
		load_next_card();
		return false;
	});

	function populate_cards_for_today() {
		cards_left_today = [];
		cards_unlearned = [];
		if (typeof($db) != 'undefined') {
			for(var i = 0; i < $fc.length; i++) {
				if ($db[i] && $db[i]['next_date']) {
					next_date = new Date(Date.parse($db[i]['next_date']));
					curr_date = new Date();
					if (next_date.toDateString() == curr_date.toDateString())
						cards_left_today.push(parseInt(i));
				} else {
					cards_left_today.push(parseInt(i));
				}
				if ($db[i] && $db[i]['ef']) {
					if ($db[i]['ef'] < 4.0)
						cards_unlearned.push(parseInt(i));
				} else {
					cards_unlearned.push(parseInt(i));
				}
			}
		} else {
			for (var i = 0; i < $fc.length; i++) {
				cards_left_today.push(parseInt(i));
				cards_unlearned.push(parseInt(i));
			}
		}
	}

	// The next card is selected from cards that need to be reviewed today, as based on the
	// SM2 algorithm. If we're out of cards to review for today, then we choose from any cards
	// that have an easiness factor less than 4. Once that list is exhausted, then we fall back
	// to choosing cards at random.
	function select_next_card() {
 		if (cards_left_today.length == 0) {
			if (cards_unlearned.length == 0) {
 				next_index = Math.floor(Math.random() * $fc.length);
			} else {
				next_index = cards_unlearned[Math.floor(Math.random() * cards_unlearned.length)];
			}
 		} else {
			next_index = cards_left_today[Math.floor(Math.random() * cards_left_today.length)];
		}
		// Don't show the same card twice.
 		while (next_index == index && $fc.length > 1) {
 			next_index = Math.floor(Math.random() * $fc.length);
		}
		return next_index;
	}

	function save_card_data(quality) {
		quality = parseInt(quality);
		if (typeof($db) != 'undefined') {
			if (!$db[index]) {
				$db[index] = {'ef' : 2.5, 'next_date' : null, 'reps' : 0, 'interval' : 0 };
			}
			$db[index]['ef'] = parseFloat($db[index]['ef']) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
			if ($db[index]['ef'] < 1.3) { $db[index]['ef'] = 1.3; }
			if (quality < 3) {
				$db[index]['reps'] = 1;
			} else {
				$db[index]['reps'] += 1;
			}
			interval = calculate_interval($db[index]['reps'], quality, $db[index]['interval']);
			$db[index]['interval'] = interval;
			one_day = 1000 * 60 * 60 * 24;
			next_date = new Date();
			next_date.setTime(next_date.getTime() + one_day * interval);
			$db[index]['next_date'] = next_date.toDateString();
			if (cards_left_today.indexOf(index) != -1) {
				cards_left_today.splice(cards_left_today.indexOf(index), 1);
			}
			if ($db[index]['ef'] >= 4.0) {
				if (cards_unlearned.indexOf(index) != -1) {
					cards_unlearned.splice(cards_unlearned.indexOf(index), 1);
				}
			} else {
				if (cards_unlearned.indexOf(index) == -1) {
					cards_unlearned.push(parseInt(index));
				}
			}
			store_data();
		}
	}

	// SM2 Algorithm for calculating intervals.
	function calculate_interval(reps, q, i) {
		if (reps == 1)
			return 1;
		else if (reps == 2)
			return 6;
		else {
			return (i * q > 60) ? 60 : parseInt(i * q);
		}
	}

	function update_progress_bar() {
		$('#progress-bar').show();
		calculate_progress();
		$('#progress-bar').html('<span>(Card #' + (index + 1) + ' of ' + $fc.length + ')</span> ' + progress + '% ' + '<span>(' + cards_left_today.length + ' left today)</span>');
		$('#debug').html('DB: ' + JSON.stringify($db) + "<br>" +
		'cards_left_today: ' + JSON.stringify(cards_left_today) + "<br>" +
		'cards_unlearned: ' + JSON.stringify(cards_unlearned));
	}

	function store_data() {
		$.setItem($set_name + '_card_counts', [cards_left_today.length, $fc.length]);
		$.setItem($set_name + '_date', (new Date()).toDateString());
		$.setItem($set_name, $db);
	}

	function calculate_progress() {
		if (cards_left_today && cards_left_today.length > 0) {
			progress = Math.round(parseFloat(100 - (100 * (cards_left_today.length / $fc.length))));
		} else if (cards_left_today) {
			progress = 100;
		} else {
			progress = 0;
		}
	}

	function load_data() {
		if (!$db || $db.length == 0) {
			try {
				$db = $.getItem($set_name) || [];
			} catch (SyntaxError) {
				$db = [];
			}
			return;
		}
	}

	start_it_up();

});