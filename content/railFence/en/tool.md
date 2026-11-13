# About the Rail fence cipher

The Rail fence cipher writes the message in a {{term:zigzag}} across a
number of rows — the rails — and then reads the rails one after the
other, top to bottom. No letter changes, only their order, so it is a
{{term:transposition}} cipher. It was quick pencil work for soldiers in
the American Civil War, and just as quick to break.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the result
  appears in {{control:output}}.
- Choose the number of rails, from 2 to 10, with {{control:rails-picker}}.
  The default is 3.
- Set the rail the zigzag starts on with {{control:offset-picker}}. The
  classic fence starts at the top; any other start hides the telltale
  first letter.
- Under the settings, {{control:zigzag-fence}} draws the letters on
  their rails as you type.
- Only letters are kept and the output is in capitals. Tick
  {{control:keep-spaces}} to let spaces ride the fence too; digits and
  punctuation are dropped.
- Press {{control:swap}} to decrypt with the same rails and offset.

## A quick example

`ATTACKATDAWN` on 3 rails gives `ACDTAKTANTAW`. The top rail holds
A, C, D; the middle rail T, A, K, T, A, N; the bottom rail T, A, W.
Read them one after the other: `ACD` + `TAKTAN` + `TAW`.

## Go further

With only a handful of rail counts and offsets, every rail fence falls
to trying them all.

- [How the Rail fence cipher works](/encoder/railFence/learn), rail by
  rail
- [Break a Rail fence cipher without the key](/encoder/railFence/cryptanalysis)
- [The history of the Rail fence cipher](/encoder/railFence/history),
  from the scytale to the Civil War
- [Rail fence practice challenges](/encoder/railFence/practice)
