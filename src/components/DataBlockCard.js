'use strict';
/**
 * DataBlockCard is analoguous to a "Data Point" in Dark Sky terminology
 *
 *  TODO: propTypes
 *  TODO:  57.99999999999999% -> 57.9%
 *  TODO: test
 */

import React from "react"
import PropTypes from "prop-types"
import util from "../util"
const { iconToUrl, unixTime, toFixed } = util
import moment from "moment-timezone"
import {
  Card,
  CardBlock,
  CardHeader,
} from 'react-bootstrap-card';

// TODO: export these two so other modules may use them
const dataPtKeyInfo = {
  cloudCover: {
    optional: true,
    unit: "percent",
    desc: "Cloud Cover"
  },
  dewPoint: {
    optional: true,
    unit: "fahrenheit",
    desc: "Dew Point"
  },
  humidity: {
    optional: true,
    unit: "percent",
    desc: "Humidity"
  },
  moonPhase: {
    optional: true,
    unit: "lunation",
    omittedByDataBlks: [ "minutely", "hourly" ],
    desc: "Moon Phase"
  },
  precipProbability: {
    optional: true,
    unit: "percent",
    desc: "Chance of Precipication"
  },
  pressure: {
    optional: true,
    unit: "millibars",
    desc: "Atmospheric Pressure"
  },
  summary: {
    optional: true,
    unit: "<as is>",
    desc: "TODO: this is summary go at top"
  },
  sunriseTime: {
    optional: true,
    unit: "unix time",
    omittedByDataBlks: [ "minutely", "hourly" ],
    desc: "Sunrise"
  },
  sunsetTime: {
    optional: true,
    unit: "unix time",
    omittedByDataBlks: [ "minutely", "hourly" ],
    desc: "Sunset"
  },
  temperature: {
    optional: true,
    unit: "fahrenheit",
    omittedByDataBlks: [ "minutely" ],
    desc: "Temperature"
  },
  temperatureHigh: {
    optional: true,
    unit: "fahrenheit",
    omittedByDataBlks: [ "minutely", "hourly" ],
    desc: "High"
  },
  temperatureLow: {
    optional: true,
    unit: "fahrenheit",
    omittedByDataBlks: [ "minutely", "hourly" ],
    desc: "Low"
  },
  windGust: {
    optional: true,
    unit: "mph",
    desc: "Wind Gust"
  },
  windSpeed: {
    optional: true,
    unit: "mph",
    desc: "Wind Speed"
  },
  visibility: {
    optional: true,
    unit: "miles",
    desc: "Visibility"
  }
}

const unitConversions = {
  percent: (val) => `${toFixed(val * 100)}%`,
  fahrenheit: (val) => `${toFixed(val)}°F`,
  lunation: (val) => `TODO: lunationa`,
  millibars: (val) => `${toFixed(val)}Mbar`,
  "<as is>": (val) => `${val}`,
  "unix time": (val,timezone) => `${moment.tz(unixTime(val), timezone).format('h:mma z')}`,// FIXME
  mph: (val) => `${toFixed(val)}mph`,
  miles: (val) => `${toFixed(val)} miles`
}

const DataBlockCard = (props) => {
    // 1. format time
    // NOTE: `time` is "according to the local time zone"
    let formattedTime, format, dataPtTimeFormats

    dataPtTimeFormats = {
      "minutely": "h:mma",
      "hourly": "dddd ha",
      "daily": "dddd Do"
    }
    format = dataPtTimeFormats[props.dataBlockName]
    formattedTime = moment(unixTime(props.time)).format(format)

    // 2. build list items
    let largestDescLen, paddingLen = 5, tempInd = null,
        calcPadding = (desc) => " ".repeat((largestDescLen - desc.length) + paddingLen)

    const dataPtKeysUsed = Object.keys(dataPtKeyInfo).filter((key) => {
      if (!(key in props)) {
        if (!dataPtKeyInfo[key].optional)
          throw new Error(`non-optional key: ${key} not present`)
        else return false
      } else return true
    })

    largestDescLen = dataPtKeysUsed.reduce((prev, curr) => {
      curr = dataPtKeyInfo[curr].desc.length
      return Math.max(prev, curr)
    }, -Infinity)

    const listItems = dataPtKeysUsed.map((key, ind) => {
      let { unit, omittedByDataBlks } = dataPtKeyInfo[key]

      key === "temperature" ? tempInd = ind : void(0)

      if (omittedByDataBlks && omittedByDataBlks.includes(props.dataBlockName))
        return null
      else {
        return (
          <li key={ind}>
            <span className="text-secondary">
              { dataPtKeyInfo[key].desc }
              { `${calcPadding(dataPtKeyInfo[key].desc)}` }
            </span>

            { unitConversions[dataPtKeyInfo[key].unit](props[key], "unix time" === dataPtKeyInfo[key].unit ? props.timezone : void(0)) }</li>
        )
      }
    })

    // mk sure "temperature" is at the top
    if (tempInd !== null) {
      listItems.unshift(listItems.splice(tempInd, 1)[0])
    }

    return (
      <Card className="mb-5 d-block mx-auto w-75">
        <CardBlock>
          <CardHeader>
            { formattedTime }
          </CardHeader>
            <img className="card-img-top" src={ iconToUrl(props.icon) } />
            <ul style={{
              listStyleType: "none",
              fontFamily: "monospace",
              whiteSpace: "pre"
            }}>
              { listItems }
            </ul>
        </CardBlock>
      </Card>
    )
}

export default DataBlockCard
