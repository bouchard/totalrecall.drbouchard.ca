# Total Recall
### Flash card memorization webapp.

**Stand-alone PHP script for Flash Cards with a Javascript interface and logic**

*By: Brady Bouchard*

*Contact: brady@bradybouchard.ca*

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

Browser support: Firefox 3.5+, Chrome 2+, Safari 4+, and MSIE 8+ (needed for localStorage support). Tested briefly on the iPhone, and works beautifully for me.

All set data is loaded into a Javascript array, so there are no Ajax server requests needed after
the initial page load.

All progress data is stored locally in a database, based on this short and simple jQuery plugin: <http://www.stoimen.com/blog/2010/02/25/jquery-localstorage-plugin/>

Inspiration from the beautiful stylings of cramberry.net.

### How to Use:

1. Create CSV files (format: question, answer) and save them in the 'sets' sub-directory.
	* Fields from the CSV are displayed as-is: you can use HTML for formatting, include image links, etc. Anything you can dream of - the world is yours to conquer!
2. Deploy the application to a web server that can run PHP scripts:
	* If you're running a Mac with OS X, copy this entire directory to '/Library/WebServer/Documents/'. Then go to System Preferences -> Sharing -> Web Sharing and turn it on.
	* If you're running Linux, you probably know what to do to get this to work.
	* If you're running Windows, good luck - you're best choice is to upload this directory to your school's webserver if your school has one and has PHP turned on (email them and ask if this seems over your head!).
3. Load index.php in a modern browser (Navigate to 'http://localhost/' if running this on your own computer).
4. Done!

### TODO:

* Use the SM2 algorithm for spaced interval memorization: <http://www.supermemo.com/english/ol/sm2.htm>. At the moment, we choose cards randomly, and only use the SM2's 'easiness factor' to calculate progress.