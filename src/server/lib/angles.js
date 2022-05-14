function calculateAngles(origin, points, direction) {
	/** 
	 * Calculate direction vectors of each Point and endPoint.
	 * Calculate the ange between each direction vector and `x` axis.
	 * Return sorted direction angles.
	 * @param origin Original position point.
	 * */

	let uniqueAngles = [];
	let specialCase = [];

	function addAngle(angle) {
		uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
	}

	function addAngleSpecial(angle) {
		specialCase.push(angle - 0.00001, angle, angle + 0.00001);
	}

	function makePositive(angle) {
		// if an angle is negative convert it to positive radian degree in diapason from 0 to 2*Math.PI degrees
		if (angle < 0) return angle + 2 * Math.PI;
		return angle;
	}

	function normalizeRadians(angle) {
		// If an angle is > 2*Math.PI (360 degrees) normalize it to starting from 0. Only positive angles
		if (angle > 2 * Math.PI) return angle - 2 * Math.PI;
		return angle;
	}

	function normalizeAngle(a) {
		// if an angle is negative convert it to positive radian degree in diapason from 0 to 2*Math.PI degrees
		if (a < 0) a = makePositive(a);
		return normalizeRadians(a);
	}

	let vision = Math.PI / 4;
	let leftBoundaryAngle, rightBoundaryAngle;

	let mouseDirectionAngle = normalizeAngle(direction);
	//uniqueAngles.push(mouseDirectionAngle);

	rightBoundaryAngle = normalizeAngle(mouseDirectionAngle - vision);
	uniqueAngles.push(rightBoundaryAngle);

	// leftBoundaryAngle cannot be negative if mouseDirection is already normalized (i. e. positive)
	leftBoundaryAngle = normalizeAngle(mouseDirectionAngle + vision);
	//uniqueAngles.push(leftBoundaryAngle);

	for (let p of points) {
		let angle = normalizeAngle(Math.atan2(p.y - origin.y, p.x - origin.x));

		if (leftBoundaryAngle > rightBoundaryAngle) {
			if (angle > rightBoundaryAngle && angle < leftBoundaryAngle) addAngle(angle);
		}
		if (rightBoundaryAngle > leftBoundaryAngle) {
			if (leftBoundaryAngle > angle && angle > 0) addAngleSpecial(angle);
			else if (angle > rightBoundaryAngle && angle < 2 * Math.PI) addAngle(angle);
		}
	}
	if (specialCase) {
		specialCase.push(leftBoundaryAngle);
		uniqueAngles.push(specialCase);
	}

	return uniqueAngles;
}

module.exports = calculateAngles;
