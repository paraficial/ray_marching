#version 330 core

out vec4 fragColor;

uniform float time;
uniform vec2 resolution;

const int MAX_STEPS = 64;
const int MAX_DIST = 64;
const float SURF_DIST = 0.01;
float st = sin(time);
float ct = cos(time);

vec4 getDist(vec3 p) {
    float st = sin(time);
    float ct = cos(time);
    vec4 s = vec4(st, 1, 6, (1 + ct)/2);
    vec4 s2 = vec4(st, abs(st), 3+ct, 0.1);
    float sphereDist = length(p - s.xyz) - s.w;
    float sphereDist2 = length(p - s2.xyz) - s2.w;
    float planeDist = p.y;

    if (sphereDist < sphereDist2) {
        if (sphereDist < planeDist)
            return vec4(p - s.xyz, sphereDist);
    }
    else {
        if (sphereDist2 < planeDist)
            return vec4(p - s2.xyz, sphereDist2);
    }
    return vec4(0, 1, 0, planeDist);
}

vec4 rayMarch(vec3 ro, vec3 rd) {
    float dO = 0;
    vec4 dsVec = vec4(0);
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        dsVec = getDist(p);
        dO += dsVec.w;
        if (dO > MAX_DIST || dsVec.w < SURF_DIST) break;
    }

    return vec4(dsVec.xyz, dO);
}

float getLight(vec3 p, vec3 n) {
    vec3 lightPos = vec3(0, 5, 6);
    lightPos.xz += vec2(sin(time), cos(time)*2);
    vec3 l = normalize(lightPos - p);

    vec4 dVec = rayMarch(p+n*SURF_DIST*1.1, l);
    if (dVec.w < length(lightPos - p))
        return 0.0;

    // color by normal
    float dif = clamp(dot(n, l), 0.0, 1.0);
    return dif;
}

void main() {
    //vec2 box = resolution/20;
    //vec2 grad = mod(gl_FragCoord.xy, box) / box;
    //color = vec4(grad, sin(time), 1.0);

    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.x;
    vec3 ro = vec3(0, 1, 0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));

    //float d = rayMarch(ro, rd);
    vec4 dVec = rayMarch(ro, rd);
    vec3 n = normalize(dVec.xyz);

    // lighting
    vec3 p = ro + rd * dVec.w;
    float dif = getLight(p, n);

    fragColor = vec4(vec3(dif), 1.0);
}
