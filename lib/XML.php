<?php

require_once('markdown.php');
require_once('markdown_exts.php');

class XMLParser {

	# Set the directory where your XML files are located here:
	public $directory = SETS_DIRECTORY;
	public $file_list;
	public $sets;
	public $cards;

	function __construct() {
		if (isset($this->file_list)) { return $this->file_list; }
		$this->file_list = array();
		if (is_dir($this->directory)) {
			if ($dh = opendir($this->directory)) {
				while (($file = readdir($dh)) !== false) {
					if (pathinfo($file, PATHINFO_EXTENSION) == 'xml') {
						$this->file_list[] = $file;
					}
				}
			}
		}
		sort($this->file_list);
		return $this->file_list;
	}

	function cards_in_set($file, $set_id) {
		$this->cards = array();
		if (($xml = simplexml_load_file($this->directory . urldecode($file))) !== false) {
			foreach($xml->cards->card as $card) {
				foreach(explode(',', $card->associated_sets) as $id) {
					if ($id == $set_id) {
						$this->cards[] = array($card['question'], $card['answer']);
					}
				}
			}
		} else {
			return false;
		}
	}

	function generate_sets() {
		$this->sets = array();
		foreach($this->file_list as $file) {
			if (($xml = simplexml_load_file($this->directory . urldecode($file))) !== false) {
				foreach($xml->sets->set as $set) {
					$c = "{$set['category']}";
					if (!isset($this->sets[$c])) { $this->sets[$c] = array(); }
					$this->sets[$c][] = array($set['id'], $set['name']);
				}
			} else {
				return false;
			}
		}
		return $this->sets;
	}

	function open_study_data($set_name, $formatted = true) {
		$xml_data = array();
		if (($handle = @fopen($this->directory . urldecode($filename) . '.xml', "r")) !== false) {
		    while (($data = fgetxml($handle)) !== false) {
				if (count($data) == 2 && !preg_match('/^#/i', $data[0])) {
					if ($formatted) {
						// Allow for nested list formatting, considering Excel won't
						// allow tab characters in cells.
						$data[0] = str_replace("<br />","  \n", $data[0]);
						$data[0] = preg_replace('/\n\*\*\s/', "\n\t* ", $data[0]);
						$data[0] = Markdown($data[0]);

						$data[1] = str_replace("<br />","  \n", $data[1]);
						$data[1] = preg_replace('/\n\*\*\s/', "\n\t* ", $data[1]);
						$data[1] = Markdown($data[1]);
					} else {
						$data[0] = str_replace("<br />", "\n", $data[0]);
						$data[1] = str_replace("<br />", "\n", $data[1]);
					}
					$xml_data[] = array($data[0], $data[1]);
				}
		    }
		    fclose($handle);
			return array('title' => $this->humanize($filename), 'questions' => $xml_data);
		} else {
			return false;
		}
	}

	function write_study_data($filename, $study_data) {
		@chmod($this->directory . urldecode($filename) . '.xml', 0664);
		@chmod($this->directory . urldecode($filename) . '.xml', 0666);
		if (($handle = @fopen($this->directory . urldecode($filename) . '.xml', "w")) !== false) {
			foreach($study_data['questions'] as $line) {
				$line[0] = str_replace("<br /><br />", "\n\n", $line[0]);
				$line[0] = str_replace("<br />", "  \n", $line[0]);
				$line[1] = str_replace("<br /><br />", "\n\n", $line[1]);
				$line[1] = str_replace("<br />", "  \n", $line[1]);
				fputxml($handle, $line);
			}
			fclose($handle);
			return true;
		} else {
			return false;
		}
	}

	function humanize($str) {
		return ucwords(preg_replace('/[_+]/i', ' ', $str));
	}

}

?>