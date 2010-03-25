<?php

/* This file is a part of Total Recall, the flash card webapp.
   Copyright Brady Bouchard 2010.
   Available at: http://github.com/brady8/total-recall
   See the README (README.markdown) for more information. */

// The CSV handling class.
require_once('lib/CSV.php');
// Configuration (is editing allowed?)
require_once('config/is_editing_allowed.php');

class Navigation {

	public $action;		// The current user action.
	public $page_title;
	public $study_data;
	public $csv;		// A handle to an instance of the CSV class.
	public $index;		// The index of the question/answer pair to be modified.
	public $error;		// Any error messages generated.
	public $filename;	// Filename of the current CSV file.

	function __construct() {
		if (!ALLOW_EDITING && $_SERVER['HTTP_HOST'] != 'localhost') { $this->go_back(); }
		$this->csv = new CSV;
		$this->index = (isset($_GET['index']) ? $_GET['index'] : null);
		if (isset($_GET['set'])) {
			$this->filename = $_GET['set'];
			if (isset($_GET['action']) && $_GET['action'] == 'add') {
				$this->action = 'add';
			} elseif (isset($_GET['index'])) {
				if (isset($_GET['action'])) {
					if ($_GET['action'] == 'edit') {
						$this->action = 'edit';
					} elseif ($_GET['action'] == 'save') {
						if (isset($_REQUEST['question']) && isset($_REQUEST['answer'])) {
							$this->action = 'save';
						} else {
							$this->action = 'edit';
						}
					} elseif ($_GET['action'] == 'delete') {
						$this->action = 'delete';
					} else {
						$this->go_back();
					}
				} else {
					$this->action = 'edit';
				}
			} else {
				$this->go_back();
			}
		}

		switch($this->action) {
			case 'add':
				$this->add();
				break;
			case 'edit':
				$this->edit();
				break;
			case 'save':
				$this->save();
				break;
			case 'delete':
				$this->delete();
				break;
		}
	}

	function go_back() {
		header('Location: ' . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : './'));
		exit;
	}

	function add() {
		$this->study_data = $this->csv->open_study_data($this->filename, false);
		$this->index = count($this->study_data['questions']);
		$this->page_title = 'Adding a new question';
	}

	function edit() {
		$this->study_data = $this->csv->open_study_data($this->filename, false);
		$this->page_title = 'Editing ' . urldecode($this->filename);
	}

	function save() {
		$this->study_data = $this->csv->open_study_data($this->filename, false);
		$this->study_data['questions'][$this->index] = array($_REQUEST['question'], $_REQUEST['answer']);
		$this->csv->write_study_data($this->filename, $this->study_data);
	}

	function delete() {
		$this->study_data = $this->csv->open_study_data($this->filename, false);
		unset($this->study_data['questions'][$this->index]);
		$this->csv->write_study_data($this->filename, $this->study_data);
		if ($this->study_data['questions'][$this->index - 1]) {
			$this->index--;
		} else {
			$this->index = end(array_keys($this->study_data['questions']));
		}
		$this->action = 'edit';
		$this->edit();
	}
}

$nav = new Navigation;

?>
<!DOCTYPE html>
<html>
<head>
<meta name = "viewport" content = "width = 660">
<title>Total Recall - <?php echo $nav->page_title; ?></title>
<link href="css/base.css" rel="stylesheet" type="text/css" />
<link href="css/study.css" rel="stylesheet" type="text/css" />
<script src="js/json.js" type="text/javascript"></script>
<script src="js/jquery.js" type="text/javascript"></script>
<script src="js/jquery.cookie.js" type="text/javascript"></script>
<script src="js/jquery.jstore.js" type="text/javascript"></script>
<script type="text/javascript">
//<![CDATA[
//]]>
</script>
</head>
<body>

<script type="text/javascript">
//<![CDATA[
	$(document).ready(function() {
		var isChanged = false;
		$("#save-button").click(function() {
			$('#edit-form').submit();
		});
		$("#delete-button").click(function() {
			$('#delete-form').submit();
		});
		$("#add-form").submit(function() {
			if (isChanged) {
				alert('Please save your data first.');
				return false;
			} else {
				return true;
			}
		});
		$("#question-input").change(function() {
			isChanged = true;
		});
		$("#answer-input").change(function() {
			isChanged = true;
		});
	});
//]]>
</script>

<?php if ($nav->error) : ?>
<div id="error-bar" style="border-color: #ff00cc;">
	<?php echo($nav->error); ?>
</div>
<?php endif; ?>

<div id="edit-title">
	<?php if ($nav->action == 'add') : ?>
		<a href="./">adding new question (<?php echo(count($nav->study_data['questions']) + 1); ?>)</a>
	<?php else : ?>
		<?php if ($nav->index > 0) : ?>
		<a class="nav-arrows" href="?action=edit&set=<?php echo(urlencode($_REQUEST['set'])); ?>&index=<?php echo($nav->index - 1); ?>">&laquo;</a>
		&nbsp;&nbsp;&nbsp;
		<?php endif; ?>
		<a href="./">editing question #<?php echo($nav->index + 1) ?> of <?php echo(count($nav->study_data['questions'])); ?></a>
		<?php if ($nav->index < count($nav->study_data['questions']) - 1) : ?>
		&nbsp;&nbsp;&nbsp;
		<a class="nav-arrows" href="?action=edit&set=<?php echo(urlencode($_REQUEST['set'])); ?>&index=<?php echo($nav->index + 1); ?>">&raquo;</a>
		<?php endif; ?>
	<?php endif; ?>
</div>
<div id="question-edit-box">
	<form id="edit-form" method="post" action="?action=save&set=<?php echo(urlencode($_REQUEST['set'])); ?>&index=<?php echo($nav->index); ?>">
		<div id="question-edit-content">
			<textarea name="question" id="question-input"><?php echo (isset($nav->study_data['questions'][$nav->index][0]) ? $nav->study_data['questions'][$nav->index][0] : ''); ?></textarea>
		</div>
		<div id="answer-edit-box">
			<div id="answer-edit-content">
				<textarea name="answer" id="answer-input"><?php echo (isset($nav->study_data['questions'][$nav->index][1]) ? $nav->study_data['questions'][$nav->index][1] : ''); ?></textarea>
			</div>
		</div>
	</form>
	<div id="edit-controls">
			<button id="save-button" class="edit-button">Save Question</button>
		<form id="delete-form" style="display: inline;" method="post" action="?action=delete&set=<?php echo(urlencode($nav->filename)); ?>&index=<?php echo($nav->index); ?>">
			<button id="delete-button" class="edit-button">Delete Question</button>
		</form>
		<form id="add-form" style="display: inline;" method="post" action="?action=add&set=<?php echo(urlencode($_REQUEST['set'])); ?>">
			<button id="add-button" class="edit-button">Add New</button>
		</form>
	</div>
</div>

</body>
</html>
