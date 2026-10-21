const profileName = document.querySelector('#profile-name');
const profileHandle = document.querySelector('#profile-handle');
const profileAvatar = document.querySelector('#profile-avatar');
const profileBio = document.querySelector('#profile-bio');
const editDialog = document.querySelector('#edit-dialog');
const profileForm = document.querySelector('#profile-form');

let demoUser = {};
try {
    demoUser = JSON.parse(sessionStorage.getItem('artex-demo-user') || '{}');
} catch {
    demoUser = {};
}

const savedProfile = JSON.parse(localStorage.getItem('artex-demo-profile') || '{}');
if (demoUser.displayName) {
    profileName.textContent = savedProfile.name || demoUser.displayName;
    profileHandle.textContent = `@${demoUser.email.split('@')[0]} · Санкт-Петербург`;
    profileAvatar.textContent = (savedProfile.name || demoUser.displayName).charAt(0).toLocaleUpperCase('ru-RU');
}
if (savedProfile.bio) {
    profileBio.textContent = savedProfile.bio;
}

function openProfileEditor() {
    document.querySelector('#edit-name').value = profileName.textContent;
    document.querySelector('#edit-bio-input').value = profileBio.textContent;
    editDialog.showModal();
}

document.querySelector('#edit-profile')?.addEventListener('click', openProfileEditor);
document.querySelector('#edit-bio')?.addEventListener('click', openProfileEditor);

profileForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#edit-name').value.trim();
    const bio = document.querySelector('#edit-bio-input').value.trim();
    if (!name) return;

    profileName.textContent = name;
    profileAvatar.textContent = name.charAt(0).toLocaleUpperCase('ru-RU');
    profileBio.textContent = bio;
    localStorage.setItem('artex-demo-profile', JSON.stringify({ name, bio }));
    editDialog.close();
});
