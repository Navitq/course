import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WordCloud from "react-d3-cloud";

import { socket } from "./socket";


function TagsCloud() {
    let [data, setData] = useState([{ text: "", value: 0 }]);
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit("get_tags_cloud");
        socket.on("got_tags_cloud", (dataJSON) => {
            let tags = JSON.parse(dataJSON);
            let newData = tags.map((el) => {
                return {
                    text: `${el.tag}`,
                    value: Math.round((Math.random() * 100 + 25) * 25),
                };
            });
            console.log(newData);
            setData(newData);
        });
    }, []);

    return (
        <>
            <WordCloud
                data={data}
                onWordClick={(event, d) => {
                    navigate(`/tags/${d.text}`);
                }}
            />
        </>
    );
}

export default TagsCloud;
