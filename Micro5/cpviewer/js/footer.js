/* FOOTER NAVIGATION BUTTONS BEHAVIOUR */

function getCurrentPageIndex() {
	return parseInt(parent.frames[1].document.getElementById("currentPageIndex").value, 10);
}

function enableButton(btnID, enable) {
	var buttonElem;
	buttonElem = document.getElementById(btnID);
	if (enable) {
		buttonElem.removeAttribute("disabled");
	} else {
		buttonElem.disabled = "disabled";
	}
}

function updateFooter(pageTitle, pageIndex, itemsCount) {
	// Update item title
	document.getElementById("item_title").innerHTML = pageTitle;

	// Update buttons
	enableButton("prev_btn", (pageIndex > 0));
	enableButton("next_btn", (pageIndex < itemsCount - 1));
}

function previousPage() {
	var oldIndex;
	oldIndex = getCurrentPageIndex();

	if (oldIndex > 0) {
		parent.frames[1].openLinkAtIndex(oldIndex - 1);
	}
}

function nextPage() {
	var oldIndex, itemsCount;
	oldIndex = getCurrentPageIndex();
	itemsCount = parent.itemsHash.size();

	if (oldIndex < (itemsCount - 1)) {
		parent.frames[1].openLinkAtIndex(oldIndex + 1);
	}
}


