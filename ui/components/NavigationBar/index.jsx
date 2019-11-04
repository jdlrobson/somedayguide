import preact, { h } from 'preact';

export default function () {
    return (
        <div class="menu">
            <ul class="menu__items">
                <li class="menu__item"><a class="menu__link" href="/">Home</a></li>
                <li class="menu__item"><a class="menu__link menu__link--dashboard"
                    style="display:none;" href="/dashboard/">Your dashboard</a></li>
            </ul>
        </div>
    )
};
