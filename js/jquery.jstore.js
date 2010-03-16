(function($) {

	var supported = true;
	if (typeof localStorage == 'undefined' || typeof JSON == 'undefined')
		supported = false;
	else
		var ls = localStorage;

	$.setItem = function(key, value) {
	if (!supported)
		return false;
	ls.setItem(key, JSON.stringify(value));
	};

   $.getItem = function(key) {
      if (!supported)
         return false;
      return JSON.parse(ls.getItem(key));
   };

   $.removeItem = function(key) {
      if (!supported)
         return false;
      ls.removeItem(key);
      return true;
   };

})(jQuery);
