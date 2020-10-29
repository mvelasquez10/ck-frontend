import axios from 'axios';

const safeEncoding = (string) => encodeURIComponent(string).replace(/'/g, '%27');

const CK = axios.create({
    //baseURL: 'https://localhost:44300',
    baseURL: 'localhost',
    headers: {
        put: {
            'Content-Type': 'application/json'
        },
        post: {
            'Content-Type': 'application/json'
        }
    }
})

export const setToken = token => {
    CK.defaults.headers.common = {
        ...CK.defaults.headers.common,
        Authorization: `bearer ${token}`
    }
}

export const getLanguages = () => CK.get('/Language/1/20/Active');

export const getAuthors = () => CK.get('/User/1/20/Active');

export const putPost = post => {
    const data = JSON.stringify({
        author: post.author.id,
        isActive: post.isActive,
        language: post.language.id,
        title: safeEncoding(post.title),
        description: safeEncoding(post.description),
        snippet: safeEncoding(post.snippet)
    });

    return CK.put('/Post/' + post.id, data);
}

export const postPost = post => {
    const data = JSON.stringify({
        author: post.author.id,
        language: post.language.id,
        title: safeEncoding(post.title),
        description: safeEncoding(post.description),
        snippet: safeEncoding(post.snippet)
    });

    return CK.post('/Post/', data);
}

export const getPosts = (page, filter) => CK.get(`/Post/${page}/5/Active` + filter);

export const getUser = id =>  CK.get('/User/' + id);

export const getLanguage = id => CK.get('/Language/' + id);

export const getPostByAuthorNameAndSurname = name => {
    if (name && name.trim().length > 0) {
        var nameOnly = name;
        var surname = null
        if(name.split(' ').length > 1) {
            var fullName = name.split(' ');
            nameOnly = fullName[0];
            surname = '&surname=' + fullName[1];
        }

        return CK.get('/User/1/1/Active?name=' + nameOnly + (surname ? surname : ''), {
            transformResponse: [(data) => {
                try {
                    const json = JSON.parse(data);
                    return 'author=' + json[0].id;
                } catch {
                    return 'author=0';
                }
            }]
        });
    }
}

export const logUser = (email, password) => {
    const data = JSON.stringify(
        {
            email: email,
            password: safeEncoding(password)
        }
    )

    return CK.post('/Auth', data);
}

export const resetRepo = () =>  CK.delete('/Reset');

export default CK;