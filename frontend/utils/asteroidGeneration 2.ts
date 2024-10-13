export function generatePolygon(n_points: number, radius: number, range: number): string {
    /* 
    Parameters:
        n_points: degree of polygon to be generated
        radius: the average distance of a point from the origin
        range: the range of permissible distances from the origin. Every point will be within radius ± range of the origin.
    */
    let points = ""
    let rot_step = 2*Math.PI / n_points
    for (let i = 0; i < n_points; i++) {
        let r = radius + Math.random() * 2 * range - range
        let theta = rot_step * i 
        points += r * Math.cos(theta) + "," + r * Math.sin(theta) + " "
    }
    return points
}