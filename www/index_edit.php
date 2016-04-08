﻿<?php
	session_start();
	
	if(isset($_SESSION['pseudo']))
		$user_logged = 1; // L'utilisateur est connecté
	else
		$user_logged = 0; // L'utilisateur n'est pas connecté
?>

<!DOCTYPE>
<html>
<head>
	<title>Audiosa</title>
	<link href="css/jquery.mobile-1.4.5.css" rel="stylesheet"/>
	<link href="css/content.css" rel="stylesheet"/>
	<link href="css/sidebar.css" rel="stylesheet"/>
	<link href="css/animate.css" rel="stylesheet"/>
	<link href="css/font-awesome.min.css" type="text/css" rel="stylesheet" />

	<link href="css/jquery.mCustomScrollbar.css" rel="stylesheet"/>
	<link rel="stylesheet" type="text/css" href="css/transit/default.css" />
	<link rel="stylesheet" type="text/css" href="css/transit/multilevelmenu.css" />
	<link rel="stylesheet" type="text/css" href="css/transit/component.css" />
	<link rel="stylesheet" type="text/css" href="css/transit/animations.css" />
	
	<script src="js/modernizr.custom.js"></script>
	<meta name="viewport" content="maximum-scale=1">
</head>
<body>
<div id="fullPage">
	<!----------- MENU --------->
	
	<div id="menu">
		<div id="content_menu_title">
			<div id="audiosa_title" >
				<h3>
				<img id="icon_logo" src="img/logo.png" alt="logo" >&nbsp;Audiosa 
				<?php
					if($user_logged == 0)
						echo '<a class="icon_navbar" href="#popupEditionMetadonnee" data-rel="popup" data-position-to="window" data-transition="pop"><img id="image_utilisateur" src="img/user.png" alt="utilisateur"></a>';
					else
						echo '<a class="icon_navbar" href="#popupMenu" data-rel="popup" data-position-to="window" data-transition="pop"><img id="image_utilisateur" src="img/menuIcon.png" alt="utilisateur"></a>';
				?>
				
				</h3>
			</div>
		</div>
		<div id="menu_content">
			<ul id="menu_scroll" data-role="listview" style="max-height: 100%;">
				<li><a href="#" class="no-margin txt-left"><div class="cellSideBar"><img style="float: left;" class="first_icon_sidebar_cell" src="img/music_library.png" alt="Nouvelle playlist" >&nbsp;&nbsp;&nbsp;&nbsp;Ma musique</div></a></li>
				<li><a href="#popupPlaylist" data-rel="popup" data-position-to="window" data-transition="pop" class="no-margin txt-left"><div class="cellSideBar"><img class="icon_sidebar_cell" src="img/add_playlist_green.png" alt="Nouvelle playlist" >&nbsp;&nbsp;&nbsp;&nbsp;Nouvelle playlist</div></a></li>
				<li><a href="#" class="no-margin txt-left"><div class="cellSideBar"><img class="icon_sidebar_cell" src="img/play_blue.png" alt="Jouer" >&nbsp;&nbsp;&nbsp;&nbsp;Playlist 1</div></a></li>
				<li><a href="#" class="no-margin txt-left"><div class="cellSideBar"><img class="icon_sidebar_cell" src="img/play_blue.png" alt="Jouer" >&nbsp;&nbsp;&nbsp;&nbsp;Playlist 2</div></a></li>
				<li><a href="#" class="no-margin txt-left"><div class="cellSideBar"><img class="icon_sidebar_cell" src="img/play_blue.png" alt="Jouer" >&nbsp;&nbsp;&nbsp;&nbsp;Playlist 3</div></a></li>
			</ul>
		</div>
		<div id="view_more">
			<span>...</span>
		</div>
		<div id="web-player" class="cover">
		</div>
		<div id="web-player-onblur">
			<img id="web-player-img" src="img/covers/nn.jpg" alt="Default cover" />
			<div id="web-player-cmd">
				<div style="text-align: center; margin-top: 14px;">
					<img id="web-player-shuffle" src="img/player/shufflew.png" alt="shuffle">
					<span>Titre musique</span>
					<img id="web-player-sound" src="img/player/soundw.png" alt="sound">
				</div>
				<div style="text-align: center; font-size: 13px;">
				Artiste
				</div>
				<form class="full-width-slider" style="margin-top: -12px; margin-bottom: 0 !important">
				    <label for="slider-12" class="ui-hidden-accessible">Slider:</label>
				    <input type="range" name="slider-12" id="slider-12" min="0" max="100" value="0">
				</form>
				<div style="text-align: center; font-size: 13px; margin-top: -8px;">
				00:00
				</div>
				<div style="text-align: center; margin-top: 14px;">
					<img id="web-player-previous" class="player_cmds" src="img/player/previous.png" alt="previous">
					<img id="web-player-play" class="player_cmds" src="img/player/play.png" alt="play">
					<img id="web-player-next" class="player_cmds" src="img/player/next.png" alt="next">
				</div>
			</div>
		</div>

	</div>
	
	<!-------------- CONTENT -------------->
	<div id="content" >
		<div id="content_title">
			<h3>
				Ma musique
				<?php
					if($user_logged == 1)
						echo '<a style="z-index: 999;display: block;" id="import_button" href="#popupImport" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-icon-plus ui-btn-icon-right ui-corner-all">Importer</a>';
					else
						echo '<a style="z-index: 999;display: none" id="import_button" href="#popupImport" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-icon-plus ui-btn-icon-right ui-corner-all">Importer</a>';
				?>
			</h3>
		</div>
<div id="pt-main" class="pt-perspective">
	<div class="pt-page pt-page-1">
		<div id="list_morceaux" class="list_musique">
			<ul class="list_scroll" data-role="listview" data-autodividers="true" data-filter="true" data-inset="true">
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Andrea Clark<br><span class="morceaux-artist-album">Artist - Album</span></div><?php if($user_logged == 1) { ?> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div><?php } ?></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Beverly Graham<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Christina Morales<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Denise Patterson<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Deborah Curtis<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Edward Barnett<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Hannah Carpenter<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Jane Carter<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Jane Gray<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>		
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">John Welch<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Laura Burke<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Michelle May<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Melissa Mendez<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Temps mort 2.0<br><span class="morceaux-artist-album">Booba - D.U.C</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Virginia Kim<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">William Fisher<br><span class="morceaux-artist-album">Artist - Album</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">#BEWEMONAMI<br><span class="morceaux-artist-album">Niro - Si j'me souviens</span></div> <div style="float: right;"><img style="width: 50px; height: 50px; margin-top: 6px;" src="img/zik.png"></div></a></li>		
			</ul>
		</div>
	</div>
	<div class="pt-page pt-page-2">
		<div id="list_artiste" class="list_musique" style="display: block;">
			<ul class="list_scroll" data-role="listview" data-autodividers="true" data-filter="true" data-inset="true">
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Andrea Clark<br><span class="morceaux-artist-album">3 Albums - 36 Morceaux</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Beverly Graham<br><span class="morceaux-artist-album">3 Albums - 36 Morceaux</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Christina Morales<br><span class="morceaux-artist-album">3 Albums - 36 Morceaux</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Denise Patterson<br><span class="morceaux-artist-album">3 Albums - 36 Morceaux</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Deborah Curtis<br><span class="morceaux-artist-album">3 Albums - 36 Morceaux</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Edward Barnett<br><span class="morceaux-artist-album">3 Albums - 36 Morceaux</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Hannah Carpenter<br><span class="morceaux-artist-album">3 Albums - 36 Morceaux</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Jane Carter<br><span class="morceaux-artist-album">3 Albums - 36 Morceaux</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Jane Gray<br><span class="morceaux-artist-album">3 Albums - 36 Morceaux</span></div> </a></li>		
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">John Welch<br><span class="morceaux-artist-album">Artist - Album</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Laura Burke<br><span class="morceaux-artist-album">Artist - Album</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Michelle May<br><span class="morceaux-artist-album">Artist - Album</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Melissa Mendez<br><span class="morceaux-artist-album">Artist - Album</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Temps mort 2.0<br><span class="morceaux-artist-album">Booba - D.U.C</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Virginia Kim<br><span class="morceaux-artist-album">Artist - Album</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">William Fisher<br><span class="morceaux-artist-album">Artist - Album</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">#BEWEMONAMI<br><span class="morceaux-artist-album">Niro - Si j'me souviens</span></div> </a></li>		
			</ul>
		</div>
	</div>
	<div class="pt-page pt-page-3">
		<div id="list_album" class="list_musique" style="display: block;">
			<ul class="list_scroll" data-role="listview" data-autodividers="true" data-filter="true" data-inset="true">
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>		
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>
				<li><a class="no-margin txt-left list-central-morceaux" href="index.html"><div class="cover"><img class="default-cover-morceaux" src="img/covers/default.jpg" alt="Default cover" /></div><div class="morceaux-artist">Nom album<br><span class="morceaux-artist-album">13 musiques</span></div> </a></li>		
			</ul>
		</div>
	</div>
</div>
		<!--<button id="iterateEffects" class="pt-touch-button">Show next page transition</button>-->
		<div id="footer_bar">
			<form class="no-margin">
				<fieldset class="txt-center" data-role="controlgroup" data-type="horizontal" data-mini="true">
					<input class="menu_morceaux paging_morceaux" type="radio" name="radio-choice-h-6" id="radio-choice-morceaux" value="on" checked="checked">
					<label id="transi_morceaux" style="height: 28px;" class="paging paging_morceaux" for="radio-choice-morceaux">Morceaux</label>
					<input class="menu_artist paging_artiste" type="radio" name="radio-choice-h-6" id="radio-choice-artist" value="off">
					<label id="transi_artiste" style="height: 28px;" class="paging paging_artiste" for="radio-choice-artist">Artistes</label>
					<input class="menu_album paging_album" type="radio" name="radio-choice-h-6" id="radio-choice-album" value="other">
					<label id="transi_album" style="height: 28px;" class="paging paging_album" for="radio-choice-album">Albums</label>
				</fieldset>
			</form>
		</div>
	</div>
</div>

<div data-role="popup" id="popupConnexion" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="width:400px;">
	<div data-role="header" data-theme="a">
		<a href="#" onclick="blurAction(0, document.getElementById('fullPage'));" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back">No text</a>
		<h1>Connexion</h1>
	</div>
	<div role="main" class="ui-content">
		<form id="formConnexionPopup" method="post" action="apis/connexion.php">
			<img src="img/logo.png" alt="logo" height="100px" width="100px" />
			<div class="ui-corner-all custom-corners">
  					<div id="messageInfoConnexionDiv" class="ui-bar ui-bar-a" style="background-color: #e74c3c;display: none;">
					<span id="messageInfoConnexionLabel" class="messageInfoLabel">Mot de passe incorrect !</span>
				</div>
			</div>
			<!--<i class="fa fa-refresh fa-spin"></i>-->
			<input placeholder="Pseudo" data-theme="a" name="pseudo" id="pseudo-text" value="" autocomplete="off" type="text">
			<input placeholder="Mot de passe" data-theme="a" name="password" id="password-text" value="" type="password" autocomplete="off" type="password">
			
			<a href="#popupMotDePasseOublie" onclick="navigateToPopupID('#popupMotDePasseOublie');" data-rel="popup" data-position-to="window" data-transition="pop" id="motDePasseOublie"><u><b>Mot de passe oublié ?</u></b></a>
			<br/><br/>
			<button id="connexionButton" type="submit" class="ui-btn ui-corner-all button_selection" style="background-color: #16a085">Se connecter</button>
		</form>
	</div>
</div>

<div data-role="popup" id="popupMenu" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="width:340px;">
	<div data-role="header" data-theme="a">
		<a href="#" onclick="blurAction(0, document.getElementById('fullPage'));" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back">No text</a>
		<h1>Menu</h1>
		
	</div>
	<div id="menuPanel" role="main" style="text-align: center; display: block;" class="ui-content">
		<img id="userImage" src="img/userAdmin.png" alt="utilisateur"></a><br />
		<span id="userLabel">Admin</span>
		<hr style="visibility:hidden;" />
		<a id="changerpassButton" class="ui-btn ui-corner-all button_selection" role="button" style="background-color: #2980b9" onclick="navigateToPopupID('#popupChangerPass');" href="#popupChangerPass" data-rel="popup" data-position-to="window" data-transition="pop">Changer mot de passe</a>
		<a id="visualiserLogButton" class="ui-btn ui-corner-all button_selection" role="button" style="background-color: #7f8c8d" onclick="" href="#popupVisualiserLogs" data-rel="popup" data-position-to="window" data-transition="pop">Visualiser les logs</a>
		<button id="deconnexionButton" onclick="disconnect();" class="ui-btn ui-corner-all button_selection" style="background-color: #c0392b">Déconnexion</button>
	</div>
</div>

<div data-role="popup" id="popupChangerPass" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="width:340px;">
	<div data-role="header" data-theme="a">
		<a id="backToMenu" href="#popupMenu" data-rel="popup" data-position-to="window" data-transition="pop" onclick="navigateToPopupID('#popupMenu');" class="ui-btn ui-icon-carat-l ui-btn-icon-notext ui-corner-all">No text</a>
		<h1>Mot de passe</h1>
	</div>
	<div id="menuPanel" role="main" style="text-align: center; display: block;" class="ui-content">
		<form id="formChangerMotDePassePopup" method="post" action="apis/changepass.php">
			<img id="userImage" src="img/changepass_icon.png" alt="utilisateur"></a><br />
			<div class="ui-corner-all custom-corners">
  					<div id="messageInfoDivChangerPass" class="ui-bar ui-bar-a" style="background-color: #e74c3c;display: none;">
					<span id="messageInfoChangerPassLabel" class="messageInfoLabel">Mot de passe incorrect !</span>
			</div>
			</div>
			<input placeholder="Mot de passe actuel" data-theme="a" name="currentPassword" id="currentPassword-text" value="" autocomplete="off" type="password">
			<input placeholder="Nouveau mot de passe" data-theme="a" name="newPassword" id="newPassword-text" value="" autocomplete="off" type="password">
			<input placeholder="Confirmation" data-theme="a" name="confirmPassword" id="confirmPassword-text" value="" autocomplete="off" type="password">
			<input type="hidden" name="pseudoName" id="pseudoName-text" value="">
			<br/>
			<button id="changerPassButton" type="submit" class="ui-btn ui-corner-all button_selection" style="background-color: #2980b9">Changer le mot de passe</button>
		</form>
	</div>
</div>

<div data-role="popup" id="popupVisualiserLogs" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="width:450px; max-height:400px;">
	<div data-role="header" data-theme="a">
		<a id="backToMenu" href="#popupMenu" data-rel="popup" data-position-to="window" data-transition="pop" onclick="navigateToPopupID('#popupMenu');" class="ui-btn ui-icon-carat-l ui-btn-icon-notext ui-corner-all">No text</a>
		<h1>Logs</h1>
	</div>
	<div id="menuPanel" role="main" style="text-align: center; display: block;" class="ui-content">
		<ul id="listview-log" data-icon="false" data-role="listview" data-inset="true" style="height:auto; max-height:300px; overflow: hidden !important;">
		</ul>
	</div>
</div>

	
<div data-role="popup" id="popupImport" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="width:400px;">
	<div data-role="header" data-theme="a">
		<a href="#" onclick="blurAction(0, document.getElementById('fullPage'));" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back">No text</a>
		<h1>Importer</h1>
	</div>
	<div role="main" style="height: 280px;" class="ui-content">
		<form id="uploadForm" method="post" action="apis/upload.php" enctype="multipart/form-data">
			<input id="fileUpload" type="file" name="upl" />
		</form>
		<br />
		<div class="uploadAnimation" role="button" aria-label="Upload file"></div>
		<h2 id="uploadLabel">Mettre en ligne</h2>
	</div>
</div>

<div data-role="popup" id="popupMotDePasseOublie" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="width:360px;">
	<div data-role="header" data-theme="a">
		<a id="backToMenu" href="#popupConnexion" data-rel="popup" data-position-to="window" data-transition="pop" onclick="navigateToPopupID('#popupConnexion');" class="ui-btn ui-icon-carat-l ui-btn-icon-notext ui-corner-all">No text</a>
		<h1>Mot de passe oublié</h1>
	</div>
	<div role="main" style="text-align: center;" class="ui-content">
		<form id="formOublieMotDePassePopup" method="post" action="apis/forgot_password.php">
			<img id="userImage" src="img/changepass_icon.png" alt="utilisateur"></a><br />
			<div class="ui-corner-all custom-corners">
  				<div id="messageInfoDivOubliePass" class="ui-bar ui-bar-a" style="background-color: #e74c3c;display: none;">
				<span id="messageInfoOubliePassLabel" class="messageInfoLabel">Mot de passe incorrect !</span></div>
			</div>
			<input placeholder="Adresse mail" data-theme="a" name="email" id="email-text" value="" type="text" autocomplete="off">
			<br/>
			<button id="oubliePassButton" type="submit" class="ui-btn ui-corner-all button_selection" style="background-color: #2980b9">Valider</button>
		</form>
	</div>
</div>
	
<div data-role="popup" id="popupEditionMetadonnee" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="width:500px;">
	<div data-role="header" data-theme="a" style="height:150px;">
		<a href="#" onclick="blurAction(0, document.getElementById('fullPage'));" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back">No text</a>
		<h1>Edition</h1>
		<a href="#" onclick="blurAction(0, document.getElementById('fullPage'));" class="ui-btn ui-icon-check ui-btn-icon-notext ui-corner-all" data-rel="back">No text</a>
		<img id="imgCoverEditionMetadonnee" src="img/covers/defaultCover.jpg" alt="albumCover"></a>
		<div class="divHeaderEdition">
			<span id="titreMusiqueEdition">Validé</span><br />
			<span id="nomArtisteEdition">Booba ft. Benash</span><br />
			<span id="nomAlbumEdition">Nero némesis</span>
		</div>
	</div>
	<div role="main" style="height: 380px; text-align: center;" class="ui-content">
		<form>
			<fieldset id="fieldset_radio_choice" data-role="controlgroup" data-theme="b" data-type="horizontal">
				<input type="radio" name="radio_choice_edition" id="radio_choice_detail_edition" value="on" checked="checked">
				<label class="radio_choice_label_edition" for="radio_choice_detail_edition">Détails</label>
				<input type="radio" name="radio_choice_edition" id="radio_choice_pochette_edition" value="off">
				<label class="radio_choice_label_edition" for="radio_choice_pochette_edition">Pochette</label>
			</fieldset>
		</form>
		
		<div id="listview-editionMetadonnee" style="height:270px;">
		<ul data-icon="false" style="min-height:270px; overflow: hidden !important;" data-role="listview" data-inset="true" >
				<li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li>
				<li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li>
				<li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li>
				<li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li><li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li>
				<li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li>
				<li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li>
				<li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li>
				<li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li>
				<li class="cellMetadonnee">
					<span class="metadonnee_label" for="text-4">Titre</span>
					<input data-theme="s" data-wrapper-class="metadonnee_field" type="text" data-mini="true" name="text-4" id="text-4" value="" />
				</li>
		</ul>
		</div>
		<br />
		<button id="addMetatagButton" type="submit" class="ui-btn ui-corner-all button_selection">Ajouter une métadonnée</button>
	</div>
</div>

<div data-role="popup" id="popupPlaylist" data-overlay-theme="b" data-theme="b" data-dismissible="false">
		<div data-role="header" data-theme="a">
			<a href="#" id="quitPlaylistButton" onclick="blurAction(0, document.getElementById('fullPage'));"  class="ui-btn ui-btn-left ui-icon-delete ui-btn-icon-notext ui-corner-all" data-rel="back">No text</a>
			<a onclick="navigateToPopupID('#popupPlaylist');" href="#popupPlaylist" data-rel="popup" data-position-to="window" data-transition="pop" style="display: none;" id="backPlaylistChoice" class="ui-btn ui-btn-left ui-icon-carat-l ui-btn-icon-notext ui-corner-all" >No text</a>
			<h1>Générer une playlist</h1>
			<a onclick="navigateToPopupID('#popupPlaylist');" href="#popupPlaylist" data-rel="popup" data-position-to="window" data-transition="pop" id="create_playlist" style="display: none;" class="ui-btn ui-btn-right ui-icon-carat-r ui-corner-all" >Créer</a>
		</div>
		<div role="main" id="animate_playlist" style="height: 475px; width: 587px;" class="ui-content">
			<div id="choix">
				<h1 class="txt-center" style="margin-bottom: 20px;" >Veuillez faire vos choix</h1>
				<a onclick="navigateToPopupID('#popupPlaylist');" href="#popupPlaylist" data-rel="popup" data-position-to="window" data-transition="pop" id="choice_genres" class="choice_click"><div class="categories cat_genres">
				</div></a>
				<a onclick="navigateToPopupID('#popupPlaylist');" href="#popupPlaylist" data-rel="popup" data-position-to="window" data-transition="pop" id="choice_artistes" class="choice_click"><div class="categories cat_artistes">
				</div></a>
				<a onclick="navigateToPopupID('#popupPlaylist');" href="#popupPlaylist" data-rel="popup" data-position-to="window" data-transition="pop" id="choice_albums" class="choice_click"><div class="categories cat_albums">
				</div></a>
				<a onclick="navigateToPopupID('#popupPlaylist');" href="#popupPlaylist" data-rel="popup" data-position-to="window" data-transition="pop" id="choice_annees" class="choice_click"><div class="categories cat_annees">
				</div></a>
			</div>

			<div style="display: none;" id="set_playlist_name">
			
				<div id="messageInfoPlaylistDiv" class="ui-bar ui-bar-a" style="background-color: #e74c3c; display: none;">
					<span id="messageInfoPlaylistLabel" class="messageInfoLabel">Entrez un nom de playlist valide</span>
				</div>
				
				<h4> Choissisez un nom pour votre playlist </h4>
				<input style="background-color: #E9E9E9; color: black;" id="nom_playlist_input" type="text" placeholder=">> Nom de la playlist" /><br>
				<a id="valider_playlist" class="ui-btn ui-corner-all button_selection" role="button" style="background-color: #2980b9">Créer la playlist</a>

			</div>
			
			<div id="list_genres" style="max-height: 450px; overflow-y: scroll; oerflow-x: hidden; display: none;">
			
				<div id="classique" class="categories categories_genres cat_genres">
					
					<div class="genre_title">Classique</div>
				</div>
				
				<div id="jazz" class="categories categories_genres cat_genres">
				
					<div class="genre_title">Jazz</div>
				</div>
				
				<div id="rap" class="categories categories_genres cat_genres">
				
					<div class="genre_title">Rap</div>
				</div>
				
			</div>
			
			<div id="list_albums" style="max-height: 450px; overflow-y: scroll; oerflow-x: hidden; display: none;">
			
				<div id="album1" class="categories categories_albums cat_c_albums cat_albums ">
					
					<div class="album_title">Album 1</div>
				</div>
				
				<div id="album2" class="categories categories_albums cat_c_albums cat_albums">
				
					<div class="album_title">Album 2</div>
				</div>
				
				<div id="album3" class="categories categories_albums cat_c_albums cat_albums">
				
					<div class="album_title">Album 3</div>
				</div>
				
			</div>
			
			<div id="list_artistes" style="max-height: 450px; overflow-y: scroll; oerflow-x: hidden; display: none;">
			
				<div id="artiste1" class="categories categories_artistes cat_c_artistes cat_artistes">
					
					<div class="artist_title">Artiste 1</div>
				</div>
				
				<div id="artiste2" class="categories categories_artistes cat_c_artistes cat_artistes">
				
					<div class="artist_title">Artiste 2</div>
				</div>
				
				<div id="artiste3" class="categories categories_artistes cat_c_artistes cat_artistes">
				
					<div class="artist_title">Artiste 3</div>
				</div>
				
				<div id="artiste4" class="categories categories_artistes cat_c_artistes cat_artistes">
					
					<div class="artist_title">Artiste 4</div>
				</div>
				
				<div id="artiste5" class="categories categories_artistes cat_c_artistes cat_artistes">
				
					<div class="artist_title">Artiste 5</div>
				</div>
				
				<div id="artiste6" class="categories categories_artistes cat_c_artistes cat_artistes">
				
					<div class="artist_title">Artiste 6</div>
				</div>
				
			</div>
			
			<div id="list_annees" style="max-height: 450px; overflow-y: scroll; oerflow-x: hidden; display: none;">
			
				<div id="1980" class="categories categories_annees cat_annees">
					
					<div class="genre_title">1980</div>
				</div>
				
				<div id="1990" class="categories categories_annees cat_annees">
				
					<div class="genre_title">1990</div>
				</div>
				
				<div id="2000" class="categories categories_annees cat_annees">
				
					<div class="genre_title">2000</div>
				</div>
				
			</div>
		</div>
	</div>
		
	<script src="js/jquery.js"></script>
	<!-- Socket -->
	<script src="./js/server/socket.io.js"></script>
	<!--<script src="./js/client/client.js"></script>-->
	<!-- jQuery Upload Form Dependencies -->
	<script src="js/tweenmax.js"></script>
	<script src="js/elastic-progress.js"></script>
	<!-- jQuery Mobile -->
	<script src="js/jquery.mobile-1.4.5.js" type="text/javascript"></script>
	<!-- jQuery File Upload Dependencies -->
	<script src="js/jquery.ui.widget.js"></script>
	<script src="js/jquery.iframe-transport.js"></script>
	<script src="js/jquery.fileupload.js"></script>
	<!-- Other scripts -->
	<script src="js/global.js" type="text/javascript"></script>
	<script src="js/jquery.dlmenu.js"></script>
	<script src="js/pagetransitions.js"></script>
	<!-- generation de playlist -->
	<script src="js/playlist/choices.js"></script>
	<!-- custom scrollbar plugin -->
	<script src="js/jquery.mCustomScrollbar.js" type="text/javascript"></script>
	<script src="js/md5.min.js" type="text/javascript"></script>
	<script>
		
		<?php
 			if($user_logged == 1)
 			{
 				echo 'passwordHash = "'. $_SESSION['password'] . '";';
 				echo 'pseudo = "'. $_SESSION['pseudo'] . '";';
 				echo '$("#pseudoName-text").attr("value", pseudo);';
 			}
 			else
 			{
 				echo 'passwordHash 	= null;';
 				echo 'pseudo 		= null;';
 			}
 		?>
		
		(function($){
			$(window).load(function(){
				$(".list_scroll").mCustomScrollbar({
					theme:"minimal"
				});
				
				$("#menu_scroll").mCustomScrollbar({
					theme:"minimal"
				});
				
				$("#list_albums").mCustomScrollbar({
					theme:"minimal"
				});
				
				$("#list_artistes").mCustomScrollbar({
					theme:"minimal"
				});
				
				$("#list_annees").mCustomScrollbar({
					theme:"minimal"
				});
				
				$("#list_genres").mCustomScrollbar({
					theme:"minimal"
				});
				
				$("#listview-editionMetadonnee").mCustomScrollbar({
					theme:"minimal"
				});
				
			});
		})(jQuery);
	</script>
</body>
</html>
