const searchInput = document.querySelector('#feed-search');
const posts = [...document.querySelectorAll('.post')];
const emptySearch = document.querySelector('.empty-search');

searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim().toLocaleLowerCase('ru-RU');
    let visibleCount = 0;

    posts.forEach((post) => {
        const matches = post.textContent.toLocaleLowerCase('ru-RU').includes(query)
            || post.dataset.search.toLocaleLowerCase('ru-RU').includes(query);
        post.hidden = !matches;
        if (matches) visibleCount += 1;
    });

    emptySearch.hidden = visibleCount !== 0;
});

document.querySelectorAll('.reaction-button').forEach((button) => {
    button.addEventListener('click', () => {
        const liked = button.getAttribute('aria-pressed') === 'true';
        const count = button.querySelector('.like-count');
        button.setAttribute('aria-pressed', String(!liked));
        count.textContent = String(Number(count.textContent) + (liked ? -1 : 1));
        button.querySelector('.heart').textContent = liked ? '♡' : '♥';
    });
});

document.querySelectorAll('.save-button').forEach((button, index) => {
    const savedPosts = JSON.parse(localStorage.getItem('artex-saved-posts') || '[]');
    const isSaved = savedPosts.includes(index);
    button.setAttribute('aria-pressed', String(isSaved));
    button.textContent = isSaved ? '▣' : '⌑';

    button.addEventListener('click', () => {
        const nextSaved = new Set(JSON.parse(localStorage.getItem('artex-saved-posts') || '[]'));
        if (nextSaved.has(index)) nextSaved.delete(index);
        else nextSaved.add(index);
        localStorage.setItem('artex-saved-posts', JSON.stringify([...nextSaved]));
        const saved = nextSaved.has(index);
        button.setAttribute('aria-pressed', String(saved));
        button.textContent = saved ? '▣' : '⌑';
    });
});
