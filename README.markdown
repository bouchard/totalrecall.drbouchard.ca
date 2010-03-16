# Total Recall
## Flash card memorization webapp.

*Stand-alone PHP script for Flash Cards with a Javascript interface and logic*
*By: Brady Bouchard*
*brady@bradybouchard.ca*

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

Inspiration from the beautiful stylings of cramberry.net.

Browser support: Firefox 3.5+, Chrome 2+, Safari 4+, and MSIE 8+ (needed for localStorage support).

All set data is loaded into a Javascript array, so there are no Ajax server requests needed after
the initial page load.

All memorization data is stored locally in a database, based on this short and simple jQuery plugin:
http://www.stoimen.com/blog/2010/02/25/jquery-localstorage-plugin/

Uses the SM2 algorithm for spaced interval memorization:
http://www.supermemo.com/english/ol/sm2.htm
NOTE: Interval spacing and 'next card' selection has not been implemented yet - 'last seen' timestamps are recorded, but that's it.

### How to Use:

1. Create CSV files (format: question, answer) and save them in the 'sets' sub-directory.
2. Load this script in a browser.
3. Done!