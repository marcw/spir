/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Button,
    Text,
    View,
    Animated,
    Easing
} from 'react-native';
import LocalizedStrings from 'react-native-localization';
import IdleTimerManager from 'react-native-idle-timer';

const i18n = new LocalizedStrings({
    "en":{
        help:"Breath-in as the circle expands. Breath-out as the circle shrinks. The exercise lasts 5 minutes and will help you relax.",
        start:"Start"
    },
    "fr":{
        help:"Inspirez quand le cercle s'aggrandit. Expirez lorsqu'il rétrécit. L'exercice dure 5 minutes et vous aidera à vous détendre.",
        startAccessibility:"Commencer l'exercice de respiration"
    },
});

class Breath extends React.Component {
    startValue = 50;
    endValue = 300;
    breathDuration = 5000;
    maxDuration = 1000 * 60 * 5; // 1000ms * 60 * 5 = 5 minutes

    constructor(props) {
        super(props);
        this.state = {
            breathIn: true,
            count: 0,
        };

        this.breathValue = new Animated.Value(this.startValue);
    }

    componentWillMount() {
          IdleTimerManager.setIdleTimerDisabled(true);
    }

    componentWillUnmount() {
          IdleTimerManager.setIdleTimerDisabled(false);
    }

    componentDidMount() {
        this.breathIn();
        this.setState({start: new Date()});
    }

    shouldEnd() {
        var now = new Date();

        return ((now - this.state.start) > this.maxDuration)
    }

    breathIn() {
        if (this.shouldEnd()) {
            return this.props.onWholeCycleEnd();
        }

        this.setState({breathIn: true});
        Animated.timing(this.breathValue, {
            toValue: this.endValue,
            duration: this.breathDuration,
            easing: Easing.linear
        }).start(() => {
            this.breathOut();
        });

        this.props.onCycleUpdate();
    }

    breathOut() {
        if (this.shouldEnd()) {
            return this.props.onWholeCycleEnd();
        }

        this.setState({breathIn: false});
        Animated.timing(this.breathValue, {
            toValue: this.startValue,
            duration: this.breathDuration,
            easing: Easing.linear
        }).start(() => {
            this.breathIn()
        });
        this.props.onCycleUpdate();
    }

    render() {
        var text = "in";
        const style = {width: this.breathValue, height: this.breathValue}
        if (!this.state.breathIn) {
            text = "out";
        }

        return (
            <Animated.View style={[styles.breath, style]}>
            </Animated.View>
        );
    }
}

export default class Spir extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breath: false,
            count: 0
        }

        this.startBreath = this.startBreath.bind(this);
        this.endBreath = this.endBreath.bind(this);
        this.handleCycleUpdate = this.handleCycleUpdate.bind(this);
        this.handleWholeCycleEnd = this.handleWholeCycleEnd.bind(this);
    }

    startBreath() {
        this.setState({breath: true, count: 0, startTime: new Date()});
    }

    endBreath() {
        this.setState({breath: false})
    }

    handleCycleUpdate() {
        this.setState({count: this.state.count + 1});
    }

    handleWholeCycleEnd() {
        this.setState({breath: false});
    }

    render() {
        var view = null;
        if (this.state.breath) {
            view = <Breath onCycleUpdate={this.handleCycleUpdate} onWholeCycleEnd={this.handleWholeCycleEnd}/>
        } else {
            view = <View>
                <Text style={styles.welcome}>{i18n.help}</Text>
               <Button onPress={this.startBreath} title={i18n.start} color="white" accessibilityLabel={i18n.startAccessibility} />
            </View>
        }
        return (
            <View style={styles.container}>
                {view}
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  breath: {
      backgroundColor: '#00b0ff',
      shadowColor: '#00b0ff',
      shadowOffset: {width:0, height:0},
      shadowOpacity: .5,
      shadowRadius: 1,
      width: 100,
      height: 100,
      opacity: 1,
      borderRadius: 125,
      justifyContent: 'center',
      alignItems: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Spir', () => Spir);
