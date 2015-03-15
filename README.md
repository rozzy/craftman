# CRAFTMAN

## Как развернуть у себя
`git clone git@github.com:rozzy/craftman.git`

## Как запустить локально
`open index.html`

## Как выгружать правки
Прежде убедитесь, что вы стягивали обновления.  
`git add -A`  
`git commit -m "New person Nikita"`  
`git push origin gh-pages`

## Как добавить нового человека в тусовку
Перед этим всегда стягивайте изменения с гитхаба!  
`git fetch origin`  
`git rebase origin/gh-pages`  

Только после вносите правки.  
Загрузите картинку в `/img/manifiests/`, скопируйте название без расширения.  
Откройте `manifiests.js`, добавьте строки по структуре:
```js
"IMG_8285": { // Название картинки без расширения
    "name": "Никита", // Имя
    "text": "Мой рассказ" // Рассказ
  },
``` 

Добавить в `index.html` перед `<!-- MANIFIESTS END -->`:
```html
  <img data-mid="IMG_8285" src="img/manifiest/IMG_8285.jpg" />
  <!-- В двойные кавычки добавить ссылку, в data-mid добавить название картинки без расширения -->
```

Затем выгрузите правки по описанию.


# Как добавить новый товар
Стяните правки.  

Загрузите нужные картинки в `/img/lookbook/`, затем откройте `lookbookItems.js` и внесите в квадратные скобки в конце:
```js
{
  name: "Свитшот1", // Наименование 
  descr: "Описание товара", // Описание
  pics: ['img/lookbook/IMG_12653r.jpg', 'img/lookbook/IMG_12r7999.jpg'], // Картинки (перечислять в '' и через запятую
  sizes: ["s", "m", "l"], // Размеры
  price: 1500 // Цена (числом)
},
```  

Добавить в `index.html` перед `<!-- LOOKBOOK END -->`:
```html
<div class="lookbookItem">
  <div class="inner">
  <div class="priceBlock">
    <span class="p"></span><span class="rub">₽</span>
  </div>
  <img class="item" src="img/lookbook/IMG_160j7.jpg" />
  <!-- В двойные кавычки добавить ссылку -->
</div>
</div>
```

Выгружать по описанию.
