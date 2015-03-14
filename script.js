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
		return $('.manifiest_content').css('max-height', $('.fotorama#crewGallery').height() * .7 + 'px');
	};

	var showLoading = function(text, speed, kSpeed) {
		var speed = speed || 500,
			kSpeed = kSpeed || 1500,
			text = text || '';
		$('.loadingOverlay').fadeIn(speed);
		$('.loadingOverlay .message#loadingMessage').text(text);
		$('#krutilka').trigger('show', 1500);
		$('body').css('overflow', 'hidden');
		return true;
	};

	var hideLoading = function(speed) {
		var speed = speed || 500;
		$('.loadingOverlay').fadeOut(speed);
		$('#krutilka').trigger('hide');
		$('body').css('overflow', 'auto');
		return true;
	};

	var positionLookbookContainer = function() {
		var e = $('.__lookbookItemContainer > .lookbookItemContainer'),
			newH = $(window).height() * 0.8;
		return e.height(newH).css({
			top: ($(window).height() - newH) / 2,
			left: ($(window).width() / 4 - e.width()) / 2
		});
	};

	var closeLookbookItem = function() {
		return $('body').css('overflow', 'auto'), $('.__lookbookItemContainer').stop().fadeOut(500, function() {
			$('.__lookbookItemContainer .successMessage').hide();
			$('.__lookbookItemContainer').find('.fotorama').data('fotorama').destroy();
		});
	};

	var showLookbookItem = function(id) {
		var data = getDataByUID(id),
			el = $('.__lookbookItemContainer .innerWrapper .rightside');
		if (!data) return;
		$('body').css('overflow', 'hidden');
		positionLookbookContainer();
		$('[name=uid]', el).val(id);
		$('h4.title', el).html(data.name);
		$('p.details', el).html(data.descr);
		$('.price > span.p', el).html(data.price);
		$('ul.sizes', el).html('');
		data.sizes.map(function(s, i) {
			$('ul.sizes', el).append('<li>' + s + '</li>');
		});
		$('.__lookbookItemContainer').find('.fotorama').html('');
		data.pics.map(function(s, i) {
			$('.__lookbookItemContainer').find('.fotorama').append('<img src="' + s + '"/>');
		});
		$('ul.sizes li', el).first().addClass('active');
		$('[name=size]', el).val($('ul.sizes li', el).first().text());
		$('ul.sizes li', el).click(function() {
			$('ul.sizes li', el).removeClass('active');
			$(this).addClass('active');
			$('[name=size]', el).val($(this).text());
		});
		$('.__lookbookItemContainer').stop().fadeIn(500, function() {
			$('.__lookbookItemContainer').find('.fotorama').fotorama({
				nav: 'thumbs',
				autoplay: 5000,
				stopautoplayontouch: true,
				width: '90%',
				height: 320,
				allowFullscreen: true,
				fit: 'scaledown'
			});
		});
		return $('.__lookbookItemContainer > .lookbookItemOverlay').one('click', closeLookbookItem);
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

	var orderPlaced = function() {
		return $('textarea.message#sendFormRequest').val(''), hideLoading(), $('.lookbookItemContainer .successMessage').show();
	};

	var sendMail = function(id, name, size, info, price) {
		return $.ajax({
			type: "POST",
			url: "https://mandrillapp.com/api/1.0/messages/send.json",
			data: {
				'key': 'qVeS9Jy65GYIcb82Hl55Hw',
				'message': {
					'from_email': 'craftman.info@gmail.com',
					'to': [{
						'email': 'berozzy@gmail.com',
						'name': 'Craftman',
						'type': 'to'
					}],
					'autotext': 'true',
					'subject': 'Новый заказ',
					'html': '<b>ID товара</b>: ' + id + '<br/>' +
						'<b>Наименование</b>: ' + name + '<br/>' +
						'<b>Размер</b>: ' + size + '<br/>' +
						'<b>Информация покупателя</b>: ' + info + '<br/>' +
						'<b>Указанная цена</b>: ' + price + '<br/>' +
						'<b>Дата</b>: ' + new Date()
				}
			}
		}).done(function(response) {
			// console.log(response);
			orderPlaced();
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

	$('.fotorama#crewGallery').on('fotorama:showend fotorama:load', function(v, g, extra) {
		var data = g.activeFrame;
		if (!data) return;
		if (!!window.manifesto && !!data && !!data.mid) {
			$('#manifiest_data').find('.name').html(window.manifesto[data.mid].name);
			$('#manifiest_data').find('.text').html(window.manifesto[data.mid].text.replace("\r\n", "<br/>"));
			$('#manifiest_data').show();
			return resizeFotoramaText();
		};
	}).fotorama({
		nav: 'thumbs',
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

	$('button.sendRequest').click(function() {
		if ($('textarea.message#sendFormRequest').val().trim() == "") {
			return $('textarea.message#sendFormRequest').css('background', 'rgb(252, 227, 227)');
		} else $('textarea.message#sendFormRequest').css('background', 'white');
		showLoading('Обработка заказа');
		var _t = $('.lookbookItemContainer'),
			id = $('[name=uid]', _t).val(),
			name = $('h4.title', _t).text(),
			size = $('[name=size]', _t).val(),
			info = $('textarea.message#sendFormRequest', _t).val(),
			price = $('.price span.p', _t).text();
		return sendMail(id, name, size, info, price);
	});

	$('.lookbookItem').click(function(e) {
		var id = getUniqueID($(this).find('img.item').attr('src'));
		return showLookbookItem(id);
	});

	$('.successMessage button').click(closeLookbookItem);

	$(window).load(function() {
		$('.loadingOverlay').addClass('ready');
		hideLoading();
		$('button#more').show().click(function() {
			$('html, body').stop().animate({
				scrollTop: $('.gallery').offset().top - 30
			}, 1000);
		});
	});
});
