# Total Recall
### Flash card memorization webapp.

**Stand-alone PHP script for Flash Cards with a Javascript interface and logic**

*By: Brady Bouchard*

*Contact: brady@bradybouchard.ca*

Running demo at: <http://totalrecall.bradybouchard.ca/>

Development continues at: <http://github.com/brady8/total-recall>

------------------------------------------------------------------

Copyright Brady Bouchard 2010.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

------------------------------------------------------------------

This script/app is designed to be dead-simple: only basic editing capabilities, no user accounts, no extras - just a simple, beautiful interface for learning.

### Features:

* Beautiful, minimal, and functional interface to maximize your learning potential.
* The awesome SM2 algorithm for keeping track of learning progress and spaced intervals to optimize your learning.
* After initial page load, all data is loaded into the browser - no waiting for additional page loads or AJAX calls!
* All progress data is stored locally.
	* Uses localStorage in modern browsers, based on the simple jQuery plugin available [here](http://www.stoimen.com/blog/2010/02/25/jquery-localstorage-plugin/).

Browser support: Firefox 3.5+, Chrome 5+ (ish?), Safari 4+, and MSIE 8+ (needed for localStorage and JSON support). Tested briefly on the iPhone.

Inspiration from the beautiful stylings of cramberry.net.

Using the wonderful [Fancybox](http://fancybox.net/) for displaying overlaid images.

### How to Use:

#### Step-by-step Setup:

1. Click the '**Downloads**' button at the top of this page on Github, and download the latest packaged version.
2. Unzip the file you just downloaded (on Macs, this happens automatically).
3. Create a subdirectory named 'sets' within the folder you just unzipped.
3. Each set of flash cards will be stored a separate CSV (*comma-separated value*) file, with the format "question, answer" in the 'sets' subdirectory. Your CSV files must have the extension '.xml'. You can create CSV files easily in Microsoft Excel - just choose 'CSV (Comma-separated values)' as the format when you go to save the file.
	* Anything you type will be displayed as-is - if you want bullet lists, etc., read the next bullet point:
	* Questions and answers are formatted with [Markdown](http://daringfireball.net/projects/markdown/): you can use HTML as well if you like for formatting, include image links, etc.
4. Put the directory somewhere that a webserver can get at it:
	* If you're running a Mac with OS X, you're in luck - you have a webserver built in! Copy everything in the package you downloaded to '/Library/WebServer/Documents/'. Then go to **System Preferences -> Sharing** and turn 'Web Sharing' on.
	* If you're running Linux, you probably know what to do to get this to work.
	* If you're running Windows, good luck - you're best choice is to upload this directory to your school's webserver if your school has one and has **PHP** turned on (email them and ask if this seems over your head!).
5. Load index.php in a modern browser (Navigate to 'http://localhost/' if running this on your own computer).
6. Done!

#### Quick Setup for Advanced Users:

1. Clone the repo ("git clone http://github.com/brady8/total-recall.git"). Or download the zipped package.
2. CSV files (format: question, answer) go in the subdirectory 'sets'. Formatted with [Markdown](http://daringfireball.net/projects/markdown/), and raw HTML is fine.
3. Put the directory somewhere your local webserver can get at it, or upload it to a proper server: on Macs, /Library/WebServer/Documents is good.
4. Load it up (again, on Macs: http://localhost/).
5. Done!

### TODO:

1. More robust editing capabilities:
	* Creating/deleting entire sets.
2. Explicit support for mobile browsers:
	* Works on the iPhone, but could be optimized.
