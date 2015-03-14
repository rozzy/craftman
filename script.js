$(function(jQuery) {
	window.$retina = !!window.devicePixelRatio && window.devicePixelRatio > 1;
	if (window.$retina) {
		$('.2x').addClass('retina').removeClass('2x');
	};

	var placeKrutilka;
	(placeKrutilka = function() {
		if ($('.loadingOverlay').hasClass('ready')) {
			return false;
		};
		var e = $('.loadingOverlay').find('.middle');
		e.css('margin-top', $(window).height() / 2 - e.height());
		$('#krutilka').krutilka();
	})();

	Array.prototype.map = Array.prototype.map || function(list, func) {
		var i = list[0],
			results = [],
			result;
		for (i; i < list.length; result = func(list[i]), (result !== null) ? results.push(result) : null, i++);
		return results;
	};

	var resizeFotoramaText = function() {
		return $('.manifiest_content').css('max-height', $('.fotorama').height() * .7 + 'px');
	};

	var showLookbookItem = function(id) {
		var data = getDataByUID(id);
		if (!data) return;

	};

	var getDataByUID = function(uid) {
		return !!window.lookbookItems && window.lookbookItems.map(function(a, x, v) {
			var vv = a.pics.filter(function(e) {
				return e.indexOf(uid) != -1;
			});
			return vv[0] ? a : false;
		}).filter(function(e) {
			return !!e;
		})[0];
	};

	var getUniqueID = function(e) {
		return e.match(/([a-z0-9_-]+)\..*$/i)[1]
	};

	var sendMail = function() {
		return $.ajax({
			type: "POST",
			url: "https://mandrillapp.com/api/1.0/messages/send.json",
			data: {
				'key': 'qVeS9Jy65GYIcb82Hl55Hw',
				'message': {
					'from_email': 'test@craftman.gallery',
					'to': [{
						'email': 'berozzy@gmail.com',
						'name': 'RECIPIENT NAME (OPTIONAL)',
						'type': 'to'
					}],
					'autotext': 'true',
					'subject': 'YOUR SUBJECT HERE!',
					'html': 'YOUR EMAIL CONTENT HERE! YOU CAN USE HTML!'
				}
			}
		}).done(function(response) {
			console.log(response);
		});
	};

	(resizeTrigger = function() {
		var newH = $(window).height() * .9;
		$('header').height(newH + 'px');
		$('header h1>br').css('display', (newH <= 450 ? 'none' : 'block'));
		return resizeFotoramaText(), placeKrutilka();
	})();
	$(window).on('resize', resizeTrigger);

	var msnrySettings = {
			itemSelector: '.lookbookItem',
			isFitWidth: true,
			gutter: 0
		},
		$target = $('#catalogue'),
		msnry = $target.masonry(msnrySettings);
	$target.imagesLoaded(function() {
		$('#loadingMessage').text('Загружаю тусовку');
		$('#krutilka').trigger('show', 500);
		msnry.masonry(msnrySettings);
	}).progress(function(instance, image) {
		$(image.img).stop().fadeTo(0500, 1);
	});

	$('.fotorama').on('fotorama:showend fotorama:load', function(v, g, extra) {
		var data = g.activeFrame;
		if (!data) return;
		if (!!window.manifesto && !!data && !!data.mid) {
			$('#manifiest_data').find('.name').html(window.manifesto[data.mid].name);
			$('#manifiest_data').find('.text').html(window.manifesto[data.mid].text);
			$('#manifiest_data').show();
			return resizeFotoramaText();
		};
	}).fotorama({
		// nav: 'thumbs',
		fit: 'cover',
		width: '100%',
		ratio: '800/600',
		autoplay: 8000,
		loop: true,
		stopautoplayontouch: true,
		keyboard: true,
	});

	$('#catalogue .item').each(function() {
		var id = getUniqueID($(this).attr('src')),
			data = getDataByUID(id),
			parent = $(this).parent();
		parent.data('uid', id);
		if (!data) return;
		parent.find('.priceBlock .p').text(data.price);
	});

	$('.lookbookItem').click(function(e) {
		var id = getUniqueID($(this).find('img.item').attr('src'));
		return showLookbookItem(id);
	});

	$(window).load(function() {
		$('.loadingOverlay').addClass('ready').fadeOut(500);
		$('#krutilka').trigger('hide');
		setTimeout(function() {
			$('button#more').fadeTo(1200, 1).click(function() {
				$('html, body').stop().animate({
					scrollTop: $('.gallery').offset().top - 30
				}, 1000);
			});
		}, 1000);
	});
});
