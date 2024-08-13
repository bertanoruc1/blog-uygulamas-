// Blog yazılarını yerel depolama alanına kaydetmek için yardımcı fonksiyonlar
function getPosts() {
    return JSON.parse(localStorage.getItem('posts')) || [];
}

function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Yeni yazı formunu göster/gizle
document.getElementById('newPostButton').addEventListener('click', () => {
    document.getElementById('postForm').classList.toggle('hidden');
});

document.getElementById('cancelPostButton').addEventListener('click', () => {
    document.getElementById('postForm').classList.add('hidden');
    clearForm();
});

// Yeni yazı kaydetme
document.getElementById('savePostButton').addEventListener('click', () => {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    if (title && content) {
        const posts = getPosts();
        posts.push({ id: Date.now(), title, content, comments: [] });
        savePosts(posts);
        clearForm();
        renderPosts();
    }
});

function clearForm() {
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postForm').classList.add('hidden');
}

// Blog yazılarını göster
function renderPosts() {
    const posts = getPosts();
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <button class="editButton" data-id="${post.id}">Düzenle</button>
            <button class="deleteButton" data-id="${post.id}">Sil</button>
            <div class="commentSection">
                <h4>Yorumlar</h4>
                ${post.comments.map(comment => `<div class="comment">${comment}</div>`).join('')}
                <textarea placeholder="Yorum yaz..."></textarea>
                <button class="addCommentButton" data-id="${post.id}">Yorum Ekle</button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });

    // Düzenleme ve silme işlevleri
    document.querySelectorAll('.editButton').forEach(button => {
        button.addEventListener('click', () => {
            editPost(button.dataset.id);
        });
    });

    document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', () => {
            deletePost(button.dataset.id);
        });
    });

    // Yorum ekleme işlevi
    document.querySelectorAll('.addCommentButton').forEach(button => {
        button.addEventListener('click', () => {
            addComment(button.dataset.id, button.previousElementSibling.value);
            button.previousElementSibling.value = ''; // Yorum kutusunu temizle
        });
    });
}

// Blog yazısını düzenleme
function editPost(id) {
    const posts = getPosts();
    const post = posts.find(p => p.id == id);
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postForm').classList.remove('hidden');

    // Kaydetme butonunu güncelle
    document.getElementById('savePostButton').textContent = 'Güncelle';
    document.getElementById('savePostButton').removeEventListener('click', savePost);
    document.getElementById('savePostButton').addEventListener('click', () => {
        post.title = document.getElementById('postTitle').value;
        post.content = document.getElementById('postContent').value;
        savePosts(posts);
        renderPosts();
        clearForm();

        // Butonu eski haline döndür
        document.getElementById('savePostButton').textContent = 'Kaydet';
        document.getElementById('savePostButton').removeEventListener('click', savePost);
        document.getElementById('savePostButton').addEventListener('click', savePost);
    });
}

// Blog yazısını silme
function deletePost(id) {
    const posts = getPosts();
    const updatedPosts = posts.filter(post => post.id != id);
    savePosts(updatedPosts);
    renderPosts();
}

// Yorum ekleme
function addComment(postId, comment) {
    const posts = getPosts();
    const post = posts.find(p => p.id == postId);
    if (comment) {
        post.comments.push(comment);
        savePosts(posts);
        renderPosts();
    }
}

// Uygulama yüklendiğinde blog yazılarını göster
window.onload = renderPosts;
