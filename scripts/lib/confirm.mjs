import readline from "node:readline"

export function hasYesFlag(argv = process.argv) {
  return argv.includes("--yes") || argv.includes("-y")
}

export async function confirm(message, { yes = false } = {}) {
  if (yes) return true
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const answer = await new Promise((resolve) => {
    rl.question(`${message} [y/N] `, resolve)
  })
  rl.close()
  return /^y(es)?$/i.test(answer.trim())
}
