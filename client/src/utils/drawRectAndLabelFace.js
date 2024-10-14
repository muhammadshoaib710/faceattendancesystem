export const drawRectAndLabelFace = (descriptions, faceDB, participants, ctx) => {
  // Loop through each desc
  descriptions &&
    descriptions.forEach((desc) => {
      // Extract boxes and classes
      const { x, y, width, height } = desc.detection.box;
      const landmarksPoint = desc.landmarks._positions;

      console.log(landmarksPoint);
      // const text = desc['class'];

      if (faceDB) { // Add null check for faceDB
        const bestMatch = faceDB.findBestMatch(desc.descriptor);
        // Set styling
        if (bestMatch._label != "unknown") {
          let filterParticipants = participants.filter(
            (participant) => participant.student._id == bestMatch._label
          );
          console.log(filterParticipants);
          bestMatch._label = filterParticipants[0].student.firstName + " " + filterParticipants[0].student.lastName + " (" + filterParticipants[0].student.cardID + ")";
        }

        ctx.font = "normal 18px Gotham, Helvetica Neue, sans-serif";
        ctx.lineWidth = 2;
        ctx.strokeStyle = bestMatch._label == "unknown" ? "#E00" : "#0E0";

        // Draw 68 points
        landmarksPoint.map(point => {
          ctx.fillStyle = "#0E0";
          ctx.fillRect(point._x, point._y, 2, 2);
        });

        // Draw bounding box
        ctx.strokeRect(x, y, width, height);

        // Draw label
        ctx.fillStyle = "#0E0";
        ctx.fillText(bestMatch._label, x, y - 10);
      }
    });
};