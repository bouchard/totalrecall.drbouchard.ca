# Total Recall
### Flash card memorization webapp.

**Stand-alone PHP script for Flash Cards with a Javascript interface and logic**

*By: Brady Bouchard*

*Contact: brady@bradybouchard.ca*

Running demo at: <http://totalrecalldemo.bradybouchard.ca/>

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

This script/app is designed to be dead-simple: no editing capabilities, no user accounts, no extras - just a beautiful, simple interface for learning.

### Features:

* Beautiful, minimal, and functional interface to maximize your learning potential.
* The awesome SM2 algorithm for keeping track of learning progress and spaced intervals to optimize your learning.
* After initial page load, all data is loaded into the browser - no waiting for additional page loads or AJAX calls!
* All progress data is stored locally.
	* Uses localStorage in modern browsers, based on the simple jQuery plugin available here: <http://www.stoimen.com/blog/2010/02/25/jquery-localstorage-plugin/>

Browser support: Firefox 3.5+, Chrome 2+, Safari 4+, and MSIE 8+ (needed for localStorage support). Tested briefly on the iPhone.

Inspiration from the beautiful stylings of cramberry.net.

### How to Use:

1. Either clone this repository (git clone http://github.com/brady8/total-recall.git) or if that doesn't make sense to you, click the 'Download Source' button at the top of this page on Github.
2. Create CSV files (format: question, answer) and save them in the 'sets' sub-directory.
	* Fields from the CSV are displayed as-is: you can use HTML for formatting, include image links, etc. Anything you can dream of - the world is yours to conquer!
3. Deploy the application to a web server that can run PHP scripts:
	* If you're running a Mac with OS X, copy this entire directory to '/Library/WebServer/Documents/'. Then go to System Preferences -> Sharing -> Web Sharing and turn it on.
	* If you're running Linux, you probably know what to do to get this to work.
	* If you're running Windows, good luck - you're best choice is to upload this directory to your school's webserver if your school has one and has PHP turned on (email them and ask if this seems over your head!).
4. Load index.php in a modern browser (Navigate to 'http://localhost/' if running this on your own computer).
5. Done!

### TODO:

1. Add rudimentary editing capabilities to allow for easier formatting rather than having to edit the CSV files directly.