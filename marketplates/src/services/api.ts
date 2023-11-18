import axios from 'axios';

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiInstance.interceptors.request.use((config) => {
    const clientToken = window.localStorage.getItem('TOKEN');

    if (clientToken) {
        config.headers.Authorization = `Bearer ${clientToken}`;
    }

    return config;
});

apiInstance.interceptors.response.use(
    (config) => config,
    (error) => {
        if (error.response.data) return Promise.reject(error.response.data);

        return Promise.reject(error);
    }
);

export async function getApiStatus() {
    const response = await apiInstance.get('/');
    return response.data;
}

// export async function login(email, password) {
//     const response = await apiInstance.post('/login', {
//       email,
//       password,
//     });
//    return response.data;

//////////////////////////////////////////////////////////////////////////////////////
//     APPLIANCES   //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
export async function generateAppliance(applianceName: string, imageURL: string, imageCaption: string) {

    const response = await apiInstance.post('/appliances/create', {
        applianceName,
        imageURL,
        imageCaption

    });
    return response.data;
}

export async function fetchAppliances() {
    const response = await apiInstance.get('/appliances/');
    return response.data;
}

export async function fetchAppliancesByIds(applianceIds: string[]) {
    const applianceIdsParameter = applianceIds.join('&');
    const response = await apiInstance.get(`/appliances/${applianceIdsParameter}`);
    return response.data;
}

export async function updateApplianceById(applianceId: string, applianceName: string, pictureURL: string, pictureCaption: string) {

    const response = await apiInstance.post('/appliances/update', {
        applianceId,
        applianceName,
        pictureURL,
        pictureCaption

    });
    return response.data;
}

export async function deleteApplianceById(applianceId: string) {

    const response = await apiInstance.post('/appliances/delete', {
        applianceId,
    });
    return response.data;
}

export async function deleteAppliancesByIds(applianceIds: string[]) {

    const response = await apiInstance.post('/appliances/deleteMany', {
        applianceIds,
    });
    return response.data;
}

//////////////////////////////////////////////////////////////////////////////////////
export async function generateBasket() {

}

export async function generateIteration() {

}

export async function generateMenuItem() {

}

export async function generateMenu() {

}

export async function generateMenusSection() {

}

export async function generateOpinion() {

}

export async function generatePlace() {

}

export async function generatePost() {

}

export async function generateProduct() {

}

export async function generateTag() {

}

export async function generateUser() {

}

//  export async function login(email, password) {
//   const response = await apiInstance.post('/login', {
//     email,
//     password,
//   });
//  return response.data;
// }


// export async function register(firstName, lastName, email, password, passwordConfirm) {
//   const response = await apiInstance.post('/register', {
//     firstName,
//     lastName,
//     email,
//     password,
//     passwordConfirm
//   });
//  return response.data;
// }

// export async function getPastries() {
//   const response = await apiInstance.get('/pastries');
//   return response.data;
// }

// export async function getPastriesInStock() {
//   const response = await apiInstance.get('/pastries/remaining');
//   return response.data;
// }

// export async function getPrizes(userId, diceResults) {
//   const response = await apiInstance.post('/pastries/prizes', {
//     userId,
//     diceResults,
//   })
//   return response.data;
// }

// export async function getUser(userId) {
//   const response = await apiInstance.post('/user', {
//     userId,
//   })
//   return response.data;
// }

// export async function patchUserResults(userId, results) {
//   const response = await apiInstance.patch('/user/results', {
//     userId,
//     results,
//   })
//   return response.data;
// }

// export async function patchUserTries(userId, remainingTrials) {
//   const response = await apiInstance.patch('/user/trials', {
//     userId,
//     remainingTrials,
//   });
//   return response.data;
// }

// export async function fetchUserResults(userId) {
//   const response = await apiInstance.post('/user/results', {
//     userId,
//   });
//   return response.data;
// }

// export async function fetchUserTries(userId) {
//   const response = await apiInstance.post('/user/trials', {
//     userId,
//   });
//   return response.data;
// }

// export async function rerollUserResults(userId, diceResetIndexes) {
//   const response = await apiInstance.post('/user/reroll', {
//     userId,
//     diceResetIndexes,
//   })
//   return response.data;
// }

// export async function getNewDiceResults(amount) {
//   const response = await apiInstance.post('/dice', {amount});
//   return response.data
// }