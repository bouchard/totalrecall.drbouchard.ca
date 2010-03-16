// ------------------------------------------------------------------

// This file is a part of Total Recall.

// Copyright Brady Bouchard 2010.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ------------------------------------------------------------------

$(function() {

	var $curr_index;
	var $cards_left;
	var $db;
	var $progress;

	$(document).keypress(function(e) {
		switch(e.which) {
			case 32: $('#show-answer').click(); return false; break;
			case 106: $('#0').click(); return false; break;
			case 107: $('#2').click(); return false; break;
			case 108: $('#3').click(); return false; break;
			case 59: $('#5').click(); return false; break;
		}
	});

	function start_it_up() {
		// If we are in 'study' mode.
		if ($('#question-content').length != 0) {
			load_new_card();
			show_reset_button();
		}
	}

	function show_reset_button() {
		$('#reset-database').show();
		$('#reset-database').click(function() {
			$.setItem($set_id, 0);
			$.setItem($set_id + '_progress', 0);
			$progress = null;
			$db = null;
			update_progress_bar();
			return false;
		});
	}

	function load_new_card() {
		cards_left_to_repeat();
		update_progress_bar();
		$curr_index = select_next_card();
		$('#question-content').html($fc_data[$curr_index][0]);
		$('#answer-content').html($fc_data[$curr_index][1]);
		$('#question-box').show();
	}

	function show_answer() {
		$('#question-box').hide();
		$('#answer-box').show();
		return false;
	}

	$('#show-answer').click(function() {
		if($('#answer-box').css('display')=="none") {
			$('#question-box').hide();
			$('#answer-box').show();
		}
		return false;
	});

	$('.scorebutton').click(function() {
		if($('#answer-box').css('display')=="none") { return false; }
		$('#answer-box').hide();
		save_card_data(this.id);
		load_new_card();
		return false;
	});

	function cards_left_to_repeat() {
		$cards_left = [];
		load_data();
		if ($db) {
			for($i in $fc_data) {
				if (!$db[$i] || !parseFloat($db[$i][0]) || parseFloat($db[$i][0]) < 4.0) {
					$cards_left.push($i);
				}
			}
		} else {
			for ($i in $fc_data) {
				$cards_left.push($i);
			}
		}
	}

	function select_next_card() {
		if ($cards_left.length == 0) {
			return Math.floor(Math.random() * $fc_data.length);
		}
		$next_index = $cards_left[Math.floor(Math.random() * $cards_left.length)];
		if ($next_index == $curr_index) {
			return Math.floor(Math.random() * $fc_data.length);
		} else {
			return $next_index;
		}
	}

	function save_card_data($quality) {
		$quality = parseInt($quality);
		load_data();
		if (!$db[$curr_index]) { $db[$curr_index] = [2.5, null]; }
		$db[$curr_index][0] = parseFloat($db[$curr_index][0]) + (0.1 - (5 - $quality) * (0.08 + (5 - $quality) * 0.02));
		if ($db[$curr_index][0] < 1.3) { $db[$curr_index][0] = 1.3; }
		$db[$curr_index][1] = (new Date()).toLocaleString();
		store_data();
	}

	function update_progress_bar() {
		$('#progress-bar').show();
		if (!$progress)
			$progress = $.getItem($set_id + '_progress') || 0;
		$('#progress-bar').html($progress + '%');
	}

	function store_data() {
		calculate_progress();
		$.setItem($set_id, $db);
		$.setItem($set_id + '_progress', $progress || 0);
	}

	function calculate_progress() {
		$sum = 0.0;
		for($i in $fc_data) {
			if ($db[$i] && $db[$i][0]) {
				$sum += parseFloat($db[$i][0]);
			} else {
				$sum += 1.3;
			}
		}
		$progress = Math.min(parseInt(100 * ( ($sum - 1.3 * $fc_data.length)/((4.0 - 1.3) * $fc_data.length) )), 100);
	}

	function load_data() {
		if (!$db || $db.length == 0) {
			try {
				$db = $.getItem($set_id) || [];
			} catch (SyntaxError) {
				$db = [];
			}
			return;
		}
	}

	start_it_up();

});