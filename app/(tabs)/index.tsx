import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Video } from "expo-av";
import meditationVideo from "../../assets/videos/190655-888327715_small.mp4";

const HomePage = () => {
  const [mode, setMode] = useState<
    "proactive" | "active" | "halted" | "finished"
  >("proactive");
  const [selectedTime, setSelectedTime] = useState<number>(10); // Default to 10 seconds
  const [currentTime, setCurrentTime] = useState<number>(selectedTime * 60);
  const [isPaused, setIsPaused] = useState<boolean>(false); // Pause state for halt button

  const quitSession = () => {
    setMode("proactive");
    setCurrentTime(selectedTime * 60);
  };

  const haltSession = () => {
    setIsPaused(!isPaused); // Toggle pause state
  };

  const returnToHome = () => {
    setMode("proactive");
    setCurrentTime(selectedTime * 60);
  };

  const startTimer = () => {
    setMode("active");
    setIsPaused(false);
    setCurrentTime(selectedTime * 60);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (mode === "active" && currentTime > 0 && !isPaused) {
      timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime <= 1) {
            setMode("finished"); // Transition to finished mode
            return 0; // Stop at 0
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [mode, currentTime, isPaused]);

  return (
    <View style={styles.container}>
      {/* Shared Video Background */}
      <Video
        source={meditationVideo}
        style={styles.video}
        isLooping
        shouldPlay
        resizeMode="cover"
        onError={(error) => console.log("Video Error: ", error)}
      />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        {mode === "proactive" && (
          <View style={styles.proactiveContainer}>
            <Text style={styles.heading}>Meditation Timer</Text>
            <Text style={styles.label}>Select Duration:</Text>
            <View style={styles.timeButtonsContainer}>
              {[0.17, 5, 10, 15].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.selectedTimeButton,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={styles.timeButtonText}>
                    {time === 0.17 ? "10 sec" : `${time} min`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={startTimer}>
              <Text style={styles.buttonText}>Start Meditation</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === "active" && (
          <View style={styles.activeContainer}>
            <Text style={styles.timer}>
              {Math.floor(currentTime / 60)}:
              {String(Math.floor(currentTime % 60)).padStart(2, "0")}
            </Text>
            <View style={styles.activeControlContainer}>
              <TouchableOpacity
                style={[styles.activeButton, styles.haltButton]}
                onPress={haltSession}
              >
                <Text style={styles.buttonText}>
                  {isPaused ? "Resume" : "Halt"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.activeButton, styles.quitButton]}
                onPress={quitSession}
              >
                <Text style={styles.buttonText}>Quit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {mode === "finished" && (
          <View style={styles.finishedContainer}>
            <TouchableOpacity style={styles.circle} onPress={returnToHome}>
              <Text style={styles.completeText}>Complete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2749", // Fallback for video loading
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  proactiveContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "600",
    color: "#F5F5F5",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 20,
    color: "#F5F5F5",
    marginBottom: 15,
  },
  timeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 25,
    width: "100%",
  },
  timeButton: {
    backgroundColor: "#5DA271",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    width: 80,
    alignItems: "center",
  },
  selectedTimeButton: {
    backgroundColor: "#FFE28A",
  },
  timeButtonText: { color: "#1E2749", fontSize: 16, fontWeight: "500" },
  button: {
    backgroundColor: "#5DA271",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: 180,
  },
  buttonText: {
    color: "#F5F5F5",
    fontSize: 18,
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFE28A",
    marginBottom: 30,
  },
  activeControlContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginTop: 20,
  },
  activeButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    width: "40%",
  },
  haltButton: {
    backgroundColor: "#5DA271",
  },
  quitButton: {
    backgroundColor: "#FFE28A",
  },
  finishedContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#5DA271",
    justifyContent: "center",
    alignItems: "center",
  },
  completeText: {
    fontSize: 24,
    color: "#F5F5F5",
    fontWeight: "bold",
  },
});

export default HomePage;
