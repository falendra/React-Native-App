import { SET_PLACES ,REMOVE_PLACE} from "./actionTypes"
import { uiStartLoading, uiStopLoading } from "./index"




export const addPlace = (placeName, location, image) => {
    return dispatch => {

        dispatch(uiStartLoading());

        fetch("https://us-central1-myapk-react-native.cloudfunctions.net/storeImage", {
            method: "POST",
            body: JSON.stringify({
                image: image.base64
            })
        })
            .catch(err => {
                console.log(err);
                alert("Something went wrong ...please try again");
                dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .then(parsedRes => {
                const placeData = {
                    name: placeName,
                    location: location,
                    image: parsedRes.imageUrl
                };

                return fetch("https://myapk-react-native.firebaseio.com/places.json", {
                    method: "POST",
                    body: JSON.stringify(placeData)
                })
                    .catch(err => {
                        console.log(err);
                        alert("Something went wrong ...please try again");
                        dispatch(uiStopLoading());
                    })
                    .then(res => res.json())
                    .then(parsedRes => {
                        console.log(parsedRes);
                        dispatch(uiStopLoading());
                        dispatch(getPlaces());                  //to reflect added place on findplace screen
                    });
            });

    };

};

export const getPlaces = () => {
    return dispatch => {

        fetch("https://myapk-react-native.firebaseio.com/places.json")
            .catch(err => {
                console.log(err);
                alert("Something went wrong ...please try again");
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log(parsedRes);

                const places = [];

                for (let key in parsedRes) {
                    places.push({
                        ...parsedRes[key],
                        key: key,
                        image: { uri: parsedRes[key].image }
                    })
                }
                dispatch(setPlaces(places))

            });
    }
}

export const setPlaces = places => {
    return{
        type:SET_PLACES,
        places:places
    }
};


export const deletePlace =key=>{
    
    return dispatch => {
        dispatch(removePlace(key));
        fetch("https://myapk-react-native.firebaseio.com/places/" + key + ".json", {
            method: "DELETE"
        })
            .catch(err => {
                console.log(err);
                alert("Something went wrong ...please try again");
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log("done");
            })
    };
}

export const removePlace = key => {
    return{
        type:REMOVE_PLACE,
        key:key
    };
};