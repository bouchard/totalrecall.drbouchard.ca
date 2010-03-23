<?php

require_once('markdown.php');

class CSV {

	# Set the directory where your CSV files are located here:
	public $directory = './sets/';

	function list_files() {
		$file_list = array();
		if (is_dir($this->directory)) {
			if ($dh = opendir($this->directory)) {
				while (($file = readdir($dh)) !== false) {
					if (pathinfo($file, PATHINFO_EXTENSION) == 'csv') {
						$file_list[] = $file;
					}
				}
				return $file_list;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	function open_study_data($filename, $formatted = true) {
		$csv_data = array();
		if (($handle = fopen($this->directory . urldecode($filename) . '.csv', "r")) !== false) {
		    while (($data = fgetcsv($handle)) !== false) {
				if (count($data) == 2 && !preg_match('/^#/i', $data[0])) {
					if ($formatted) {
						$data[0] = str_replace("\t","", $data[0]);
						$data[0] = str_replace("\r\n","<br />", $data[0]);
						$data[0] = str_replace("\n","<br />", $data[0]);
						$data[0] = str_replace("\r", "<br />", $data[0]);
						$data[0] = Markdown($data[0]);

						$data[1] = str_replace("\t","", $data[1]);
						$data[1] = str_replace("\r\n","<br />", $data[1]);
						$data[1] = str_replace("\n","<br />", $data[1]);
						$data[1] = str_replace("\r", "<br />", $data[1]);
						$data[1] = Markdown($data[1]);
					} else {
						$data[0] = str_replace("<br />", "\n", $data[0]);
						$data[1] = str_replace("<br />", "\n", $data[1]);
					}
					$csv_data[] = array($data[0], $data[1]);
				}
		    }
		    fclose($handle);
		} else {
			return false;
		}
		return array('title' => $this->humanize($filename), 'questions' => $csv_data);
	}

	function write_study_data($filename, $study_data) {
		if (($handle = fopen($this->directory . urldecode($filename) . '.csv', "w")) !== false) {
			foreach($study_data['questions'] as $line) {
				$line[0] = str_replace("<br /><br />", "\n\n", $line[0]);
				$line[1] = str_replace("<br /><br />", "\n\n", $line[1]);
				$line[0] = str_replace("<br />", "  ", $line[0]);
				$line[1] = str_replace("<br />", "  ", $line[1]);
				fputcsv($handle, $line);
			}
			fclose($handle);
		} else {
			return false;
		}
	}

	function humanize($str) {
		return ucwords(preg_replace('/[_+]/i', ' ', $str));
	}

}

?>