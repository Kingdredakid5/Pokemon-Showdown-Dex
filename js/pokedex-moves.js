var PokedexMovePanel = PokedexResultPanel.extend({
	initialize: function(id) {
		var move = Tools.getMove(id);
		this.id = id;
		this.shortTitle = move.name;

		var buf = '<div class="pfx-body dexentry">';

		buf += '<a href="/" class="pfx-backbutton" data-target="back"><i class="fa fa-chevron-left"></i> Pok&eacute;dex</a>';
		buf += '<h1><a href="/moves/'+id+'" data-target="push" class="subtle">'+move.name+'</a></h1>';

		if (move.id === 'magikarpsrevenge') buf += '<div class="warning"><strong>Note:</strong> Made for testing on Pok&eacute;mon Showdown, not a real move.</div>';
		else if (move.isNonstandard) buf += '<div class="warning"><strong>Note:</strong> This is a made-up move by <a href="http://www.smogon.com/cap/" target="_blank">Smogon CAP</a>.</div>';

		buf += '<dl class="movetypeentry">';
		buf += '<dt>Type:</dt> <dd>';
		buf += '<a class="type '+toId(move.type)+'" href="/types/'+toId(move.type)+'" data-target="push">'+move.type+'</a> ';
		buf += '<a class="type '+toId(move.category)+'" href="/categories/'+toId(move.category)+'" data-target="push">'+move.category+'</a>';
		buf += '</dd></dl>';

		if (move.category !== 'Status') {
			buf += '<dl class="powerentry"><dt>Base power:</dt> <dd><strong>'+(move.basePower||'&mdash;')+'</strong></dd></dl>';
		}
		buf += '<dl class="accuracyentry"><dt>Accuracy:</dt> <dd>'+(move.accuracy && move.accuracy!==true?move.accuracy+'%':'&mdash;')+'</dd></dl>';
		buf += '<dl class="ppentry"><dt>PP:</dt> <dd>'+(move.pp)+(move.pp>1 ? ' <small class="minor">(max: '+(8/5*move.pp)+')</small>' : '')+'</dd>';
		buf += '</dl><div style="clear:left;padding-top:1px"></div>';

		if (move.priority > 1) {
			buf += '<p>Nearly always moves first <em>(priority +'+move.priority+')</em>.</p>';
		} else if (move.priority <= -1) {
			buf += '<p>Nearly always moves last <em>(priority &minus;'+(-move.priority)+')</em>.</p>';
		} else if (move.priority == 1) {
			buf += '<p>Usually moves first <em>(priority +'+move.priority+')</em>.</p>';
		}

		buf += '<p>'+Tools.escapeHTML(move.desc||move.shortDesc)+'</p>';

		if ('defrost' in move.flags) {
			buf += '<p><a class="subtle" href="/tags/defrost" data-target="push">The user thaws out</a> if it is frozen.</p>';
		}
		if (!('protect' in move.flags) && move.target !== 'self') {
			buf += '<p class="movetag"><a href="/tags/bypassprotect" data-target="push">Bypasses Protect</a> <small>(bypasses <a class="subtle" href="/moves/protect" data-target="push">Protect</a>, <a class="subtle" href="/moves/detect" data-target="push">Detect</a>, <a class="subtle" href="/moves/kingsshield" data-target="push">King\'s Shield</a>, and <a class="subtle" href="/moves/spikyshield" data-target="push">Spiky Shield</a>)</small></p>';
		}
		if ('authentic' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/bypasssub" data-target="push">Bypasses Substitute</a> <small>(bypasses but does not break a <a class="subtle" href="/moves/substitute" data-target="push">Substitute</a>)</small></p>';
		}
		if (!('protect' in move.flags) && move.target !== 'self' && move.category === 'Status') {
			buf += '<p class="movetag"><a href="/tags/nonreflectable" data-target="push">&#x2713; Nonreflectable</a> <small>(can\'t be bounced by <a class="subtle" href="/moves/magiccoat" data-target="push">Magic Coat</a> or <a class="subtle" href="/abilities/magicbounce" data-target="push">Magic Bounce</a>)</small></p>';
		}
		if (!('mirror' in move.flags) && move.target !== 'self') {
			buf += '<p class="movetag"><a href="/tags/nonmirror" data-target="push">&#x2713; Nonmirror</a> <small>(can\'t be copied by <a class="subtle" href="/moves/mirrormove" data-target="push">Mirror Move</a>)</small></p>';
		}
		if (!('snatch' in move.flags) && (move.target === 'self' || move.target === 'allyTeam' || move.target === 'adjacentAllyOrSelf')) {
			buf += '<p class="movetag"><a href="/tags/nonsnatchable" data-target="push">&#x2713; Nonsnatchable</a> <small>(can\'t be copied by <a class="subtle" href="/moves/snatch" data-target="push">Snatch</a>)</small></p>';
		}

		if ('contact' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/contact" data-target="push">&#x2713; Contact</a> <small>(affected by many abilities like Iron Barbs and moves like Spiky Shield)</small></p>';
		}
		if ('sound' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/sound" data-target="push">&#x2713; Sound</a> <small>(bypasses <a class="subtle" href="/moves/substitute" data-target="push">Substitute</a>, doesn\'t affect <a class="subtle" href="/abilities/soundproof" data-target="push">Soundproof</a> pokemon)</small></p>';
		}
		if ('powder' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/powder" data-target="push">&#x2713; Powder</a> <small>(doesn\'t affect <a class="subtle" href="/types/grass" data-target="push">Grass</a>-types, <a class="subtle" href="/abilities/overcoat" data-target="push">Overcoat</a> pokemon, and <a class="subtle" href="/items/safetygoggles" data-target="push">Safety Goggles</a> holders)</small></p>';
		}
		if ('punch' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/fist" data-target="push">&#x2713; Fist</a> <small>(boosted by <a class="subtle" href="/abilities/ironfist" data-target="push">Iron Fist</a>)</small></p>';
		}
		if ('pulse' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/pulse" data-target="push">&#x2713; Pulse</a> <small>(boosted by <a class="subtle" href="/abilities/megalauncher" data-target="push">Mega Launcher</a>)</small></p>';
		}
		if ('bite' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/bite" data-target="push">&#x2713; Bite</a> <small>(boosted by <a class="subtle" href="/abilities/strongjaw" data-target="push">Strong Jaw</a>)</small></p>';
		}
		if ('bullet' in move.flags) {
			buf += '<p class="movetag"><a href="/tags/ballistic" data-target="push">&#x2713; Ballistic</a> <small>(doesn\'t affect <a class="subtle" href="/abilities/bulletproof" data-target="push">Bulletproof</a> pokemon)</small></p>';
		}

		// distribution
		buf += '<ul class="utilichart metricchart nokbd">';
		buf += '</ul>';

		buf += '</div>';

		this.html(buf);

		var self = this;
		setTimeout(this.renderDistribution.bind(this));
	},
	getDistribution: function() {
		var moveid = this.id;
		if (this.results) return this.results;
		var results = [];
		for (var pokemonid in BattleLearnsets) {
			if (BattlePokedex[pokemonid].isNonstandard) continue;
			var sources = BattleLearnsets[pokemonid].learnset[moveid];
			if (!sources) continue;
			if (typeof sources === 'string') sources = [sources];
			var atLeastOne = false;
			for (var i=0, len=sources.length; i<len; i++) {
				var source = sources[i];
				if (source.substr(0,2) === '6L') {
					results.push('a'+sourcePad(source)+pokemonid);
					atLeastOne = true;
				} else if (source === '6M') {
					results.push('b000 '+pokemonid);
					atLeastOne = true;
				} else if (source === '6T') {
					results.push('c000 '+pokemonid);
					atLeastOne = true;
				} else if (source === '6E') {
					results.push('d000 '+pokemonid);
					atLeastOne = true;
				} else if (source.charAt(1) === 'S' && atLeastOne !== 'S') {
					results.push('e000 '+pokemonid);
					atLeastOne = 'S';
				}
			}
			if (!atLeastOne) {
				results.push('f000 '+pokemonid);
			}
		}
		results.sort();
		var last = '', lastChanged = false, streamLoading = false;
		for (var i=0; i<results.length; i++) {
			if (results[i].charAt(0) !== last) {
				results.splice(i, 0, results[i].charAt(0).toUpperCase());
				i++;
			}
			last = results[i].charAt(0);
		}
		return this.results = results;
	},
	renderDistribution: function() {
		var results = this.getDistribution();
		this.$chart = this.$('.utilichart');

		var streamLoading = false;
		if (results.length > 1600/33) {
			this.streamLoading = streamLoading = true;
			this.$el.on('scroll', this.handleScroll.bind(this));

			var panelTop = this.$el.children().offset().top;
			var panelHeight = this.$el.outerHeight();
			var chartTop = this.$chart.offset().top;
			var scrollLoc = this.scrollLoc = this.$el.scrollTop();

			var start = Math.floor((scrollLoc - (chartTop-panelTop)) / 33 - 35);
			var end = Math.floor(start + 35 + panelHeight / 33 + 35);
			if (start < 0) start = 0;
			if (end > results.length-1) end = results.length-1;
			this.start = start, this.end = end;

			// distribution
			var buf = '';
			for (var i=0, len=results.length; i<len; i++) {
				buf += '<li class="result">'+this.renderRow(i, i < start || i > end)+'</li>';
			}
			this.$chart.html(buf);
		} else {
			var buf = '';
			for (var i=0, len=results.length; i<len; i++) {
				buf += '<li class="result">'+this.renderRow(i)+'</li>';
			}
			this.$chart.html(buf);
		}
	},
	renderRow: function(i, offscreen) {
		var results = this.results;
		var template = BattlePokedex[results[i].substr(5)];
		if (!template) {
			switch (results[i].charAt(0)) {
			case 'A': // level-up move
				return '<h3>Level-up</h3>';
				break;
			case 'B': // tm/hm
				return '<h3>TM/HM</h3>';
				break;
			case 'C': // tutor
				return '<h3>Tutor</h3>';
				break;
			case 'D': // egg move
				return '<h3>Egg</h3>';
				break;
			case 'E': // event
				return '<h3>Event</h3>';
				break;
			case 'F': // past gen
				return '<h3>Past generation only</h3>';
				break;
			}
			return '<pre>error: "'+results[i]+'"</pre>';
		} else if (offscreen) {
			return ''+template.species+' '+template.abilities['0']+' '+(template.abilities['1']||'')+' '+(template.abilities['H']||'')+'';
		} else {
			var desc = '';
			switch (results[i].charAt(0)) {
			case 'a': // level-up move
				desc = results[i].substr(1,3) === '001' ? '&ndash;' : '<small>L</small>'+(Number(results[i].substr(1,3)) || '?');
				break;
			case 'b': // tm/hm
				desc = '<span class="itemicon" style="margin-top:-3px;'+Tools.getItemIcon({spritenum:508})+'"></span>';
				break;
			case 'c': // tutor
				desc = '<img src="//play.pokemonshowdown.com/sprites/tutor.png" style="margin-top:-4px;opacity:.7" width="27" height="26" alt="T" />';
				break;
			case 'd': // egg move
				desc = '<span class="picon" style="margin-top:-12px;'+Tools.getPokemonIcon('egg')+'"></span>';
				break;
			case 'e': // event
				desc = '!';
				break;
			case 'f': // past generation
				desc = '...';
				break;
			}
			return BattleSearch.renderTaggedPokemonRowInner(template, desc);
		}
	},
	handleScroll: function() {
		var scrollLoc = this.$el.scrollTop();
		if (Math.abs(scrollLoc - this.scrollLoc) > 20*33) {
			this.renderUpdateDistribution();
		}
	},
	debouncedPurgeTimer: null,
	renderUpdateDistribution: function(fullUpdate) {
		if (this.debouncedPurgeTimer) {
			clearTimeout(this.debouncedPurgeTimer);
			this.debouncedPurgeTimer = null;
		}

		var panelTop = this.$el.children().offset().top;
		var panelHeight = this.$el.outerHeight();
		var chartTop = this.$chart.offset().top;
		var scrollLoc = this.scrollLoc = this.$el.scrollTop();

		var results = this.results;

		var rowFit = Math.floor(panelHeight / 33);

		var start = Math.floor((scrollLoc - (chartTop-panelTop)) / 33 - 35);
		var end = start + 35 + rowFit + 35;
		if (start < 0) start = 0;
		if (end > results.length-1) end = results.length-1;

		var $rows = this.$chart.children();

		if (fullUpdate || start < this.start - rowFit-30 || end > this.end + rowFit+30) {
			var buf = '';
			for (var i=0, len=results.length; i<len; i++) {
				buf += '<li class="result">'+this.renderRow(i, (i < start || i > end))+'</li>';
			}
			this.$chart.html(buf);
			this.start = start, this.end = end;
			return;
		}

		if (start < this.start) {
			for (var i = start; i<this.start; i++) {
				$rows[i].innerHTML = this.renderRow(i);
			}
			this.start = start;
		}

		if (end > this.end) {
			for (var i = this.end+1; i<=end; i++) {
				$rows[i].innerHTML = this.renderRow(i);
			}
			this.end = end;
		}

		if (this.end - this.start > rowFit+90) {
			var self = this;
			this.debouncedPurgeTimer = setTimeout(function() {
				self.renderUpdateDistribution(true);
			}, 1000);
		}
	}
});