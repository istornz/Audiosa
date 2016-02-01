function blurAction(state, div)
{
	if(state == 1)
	{
		div.className = "fullPageBlurred";
	}
	else
	{
		div.className = "";
	}
}