/* LEFT NAVIGATION LINKS BEHAVIOUR */

function updateNav() {
	var rootList, i, ulElements, aElements, pageIndex, aElem, liParent, sublist, ulParent;
	rootList = document.getElementById("root_list");

	// Fold all sublists
	ulElements = rootList.getElementsByTagName("ul");
	for (i = 0; i < ulElements.length; i += 1) {
		ulElements[i].className = "hide";
	}

	// Remove highlighting from all links
	aElements = rootList.getElementsByTagName("a");
	for (i = 0; i < aElements.length; i += 1) {
		aElements[i].className = "";
	}

	// Retrieve current page's link element
	pageIndex = document.getElementById("currentPageIndex").value;
	aElem = rootList.getElementsByTagName("a")[pageIndex];

	// Highlight the link by setting its class to 'current'
	aElem.className = "current";

	// If the link is associated to a sublist, unfold that sublist
	liParent = aElem.parentNode;
	sublist = liParent.getElementsByTagName("ul")[0];
	if (sublist) {
		sublist.className = "show";
	}

	// Unfold the link's parent lists
	do {
		ulParent = liParent.parentNode;
		ulParent.className = "show";
		liParent = ulParent.parentNode;
	} while (liParent.tagName === "LI");
}

function openLink(linkElem) {
	var oldHref, newIndex;
	
	// Load the new page in the content frame
	try {
		oldHref = parent.frames[2].location.href;
		parent.frames[2].location.assign(linkElem.href);
	} catch (exc) {
		// If page not found, remove focus from clicked link, display previous page and pop-up an alert
		linkElem.blur();
		parent.frames[2].location.href = oldHref;
		alert("Page not found");
		return false;
	}

	// Update the value of the hidden input element with the new page index
	newIndex = linkElem.id.substring(4, linkElem.id.length);
	document.getElementById("currentPageIndex").value = newIndex;

	// Update navigation				
	updateNav();

	// Update footer
	parent.frames[3].updateFooter(linkElem.firstChild.nodeValue, newIndex, parent.itemsHash.size());

	return false;
}

function openLinkAtIndex(index) {
	openLink(document.getElementById("root_list").getElementsByTagName("a")[index]);
}

function openDefaultPage() {
	openLinkAtIndex(document.getElementById("currentPageIndex").value);
}

