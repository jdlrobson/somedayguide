export default function cardlist(links) {
    const ul = document.createElement('ul');
    ul.innerHTML = `${links.map(({ title, url, thumbnail }, i) => `<li class="cardlist__item">
    <div class="cardlist__item__thumb" style="background-image:url(${thumbnail});"></div>
    <a class="cardlist__item__link" href="${url}">${title}</a>`).join('')}`;
    return ul;
}
