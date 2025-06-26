import { solve } from "yalps"
import { lessEq, equalTo, greaterEq } from "yalps"
import { Model } from "yalps"

export function positiveValueFill(target: number, coeffs: number[], ub?: number[], lb?: number[]) {
  const varNames = coeffs.map((_, i) => `x${i}`);

  const model: any = {
    direction: "minimize",
    objective: "dummy",
    constraints: {
      targetEq: equalTo(target),
      totalChips: greaterEq(0) // Ensure we don't remove too many chips
    },
    variables: Object.fromEntries(
      varNames.map((name, i) => [
        name,
        {
          targetEq: coeffs[i],
          totalChips: 1,
          ubConstraint: ub ? ub[i] : Infinity,
          lbConstraint: lb ? lb[i] : 0, // Ensure we keep minimum number of chips
        }
      ])
    ),
    integers: varNames,
    binaries: [],
  };

  // Add constraints for upper and lower bounds
  varNames.forEach((name, i) => {
    if (ub) {
      model.constraints[`ub_${name}`] = lessEq(ub[i]);
      model.variables[name][`ub_${name}`] = 1;
    }
    if (lb) {
      model.constraints[`lb_${name}`] = greaterEq(lb[i]);
      model.variables[name][`lb_${name}`] = 1;
    }
  });

  const sol = solve(model);

  if (sol.status === "optimal") {
    return Object.fromEntries(sol.variables as [string, number][]);
  } else {
    return null;
  }
}

type Solution = Record<string, number> | null;

export function valueChange(
  nums: number[],
  origCoeffs: number[],
  target: number,
): Solution {
  const n = nums.length;
  const varNames = Array.from({ length: n }, (_, i) => `c${i}`);
  const model: any = {
    direction: "maximize",
    objective: varNames[0],   
    constraints: {
      eqTarget: equalTo(target),
    },
    variables: {},
    binaries: [],
    integers: varNames,
  };

  // Build variables and constraints
  varNames.forEach((name, i) => {
    // variable c_i appears in eqTarget constraint with coefficient nums[i]
    model.variables[name] = {
      eqTarget: nums[i],
    };
    // lower bound: c_i >= origCoeffs[i] - 10
    const lbName = `lb_${name}`;
    model.constraints[lbName] = greaterEq(origCoeffs[i]);
    model.variables[name][lbName] = 1;

    // upper bound: c_i <= origCoeffs[i] + 10
    const ubName = `ub_${name}`;
    model.constraints[ubName] = lessEq(i != origCoeffs.length-1 ? origCoeffs[i+1]-1: 25);
    model.variables[name][ubName] = 1;
  });

  const sol = solve(model);

  if (sol.status === "optimal") {
    return Object.fromEntries(sol.variables as [string, number][])
  } else {
    return null;
  }
}