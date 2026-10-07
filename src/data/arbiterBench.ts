export type Outcome = "match" | "faithful" | "partial" | "caught" | "declined";
export type Origin = "ours" | "theirs" | "both";

export interface ArbiterBenchData {
  cases: number;
  repoList: string;
  model: string;
  harnessUrl: string;
  outcomes: Record<Outcome, number>;
  baselines: Record<"ours" | "theirs", Partial<Record<Outcome, number>>>;
  keptChangeRate: Record<"ours" | "theirs" | "arbiter", number>;
  gatePass: Record<"ours" | "theirs" | "arbiter", string>;
  withTestGate: number;
  costUsd: number;
  secondsMedian: number;
  preservationGate: { caught: string; falseAlarms: string };
  naiveGate: { caught: string; falseAlarms: string };
  ci95: Record<"faithful" | "partial" | "gateCaught" | "gateFalse", [number, number]>;
  example: {
    id: string;
    repo: string;
    file: string;
    subject: string;
    ours: string[];
    theirs: string[];
    resolved: { text: string; from: Origin }[];
    tests: string;
    verdict: string;
  };
  tiles: { id: string; files: string[]; outcome: Outcome }[];
}

export const ARBITER_BENCH: ArbiterBenchData ={
  "cases": 44,
  "repoList": "click and flask",
  "model": "Codex CLI with gpt-5.6-sol",
  "harnessUrl": "https://github.com/zekariasasaminew/pact/tree/main/bench/arbiter",
  "outcomes": {
    "match": 21,
    "faithful": 9,
    "partial": 14,
    "caught": 0,
    "declined": 0
  },
  "baselines": {
    "ours": {
      "partial": 32,
      "caught": 2,
      "faithful": 1,
      "match": 9
    },
    "theirs": {
      "partial": 33,
      "faithful": 4,
      "match": 5,
      "caught": 2
    }
  },
  "keptChangeRate": {
    "ours": 0.435,
    "theirs": 0.602,
    "arbiter": 0.892
  },
  "gatePass": {
    "ours": "33/35",
    "theirs": "33/35",
    "arbiter": "35/35"
  },
  "withTestGate": 35,
  "costUsd": 0,
  "secondsMedian": 70,
  "preservationGate": {
    "caught": "10/14",
    "falseAlarms": "1/30"
  },
  "naiveGate": {
    "caught": "13/14",
    "falseAlarms": "19/30"
  },
  "ci95": {
    "faithful": [
      53,
      80
    ],
    "partial": [
      20,
      47
    ],
    "gateCaught": [
      45,
      88
    ],
    "gateFalse": [
      1,
      17
    ]
  },
  "example": {
    "id": "flask-7a2d5fb6df",
    "repo": "flask",
    "file": "src/flask/blueprints.py",
    "subject": "Merge branch '2.1.x'",
    "ours": [
      "    @setupmethod"
    ],
    "theirs": [
      "    def app_errorhandler(",
      "        self, code: t.Union[t.Type[Exception], int]",
      "    ) -> t.Callable[[ft.ErrorHandlerDecorator], ft.ErrorHandlerDecorator]:"
    ],
    "resolved": [
      {
        "text": "    @setupmethod",
        "from": "ours"
      },
      {
        "text": "    def app_errorhandler(",
        "from": "theirs"
      },
      {
        "text": "        self, code: t.Union[t.Type[Exception], int]",
        "from": "theirs"
      },
      {
        "text": "    ) -> t.Callable[[ft.ErrorHandlerDecorator], ft.ErrorHandlerDecorator]:",
        "from": "theirs"
      }
    ],
    "tests": "kept 90 of 90 changes",
    "verdict": "every change the maintainers kept, nothing invented"
  },
  "tiles": [
    {
      "id": "click-0a81393fdf",
      "files": [
        "src/click/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "click-0aec1168ac",
      "files": [
        "CHANGES.rst",
        "src/click/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "click-29df8795dc",
      "files": [
        "CHANGES.rst",
        "src/click/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "click-3a40e43e8f",
      "files": [
        "tests/test_shell_completion.py"
      ],
      "outcome": "match"
    },
    {
      "id": "click-65eceb08e3",
      "files": [
        "CHANGES.rst",
        "src/click/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "click-7586834cab",
      "files": [
        ".github/workflows/lock.yaml"
      ],
      "outcome": "match"
    },
    {
      "id": "click-9e9fe41a53",
      "files": [
        "setup.cfg"
      ],
      "outcome": "match"
    },
    {
      "id": "click-9f63c3b477",
      "files": [
        "tox.ini"
      ],
      "outcome": "match"
    },
    {
      "id": "click-a683017931",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "match"
    },
    {
      "id": "click-b2f26437c7",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "match"
    },
    {
      "id": "click-c364303901",
      "files": [
        ".pre-commit-config.yaml"
      ],
      "outcome": "match"
    },
    {
      "id": "click-d1f8651428",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "match"
    },
    {
      "id": "click-e7cff2a3dc",
      "files": [
        "src/click/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "flask-00be8d24ac",
      "files": [
        "src/flask/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "flask-218880c7fd",
      "files": [
        "pyproject.toml"
      ],
      "outcome": "match"
    },
    {
      "id": "flask-258d68b6ff",
      "files": [
        "tests/test_reqctx.py"
      ],
      "outcome": "match"
    },
    {
      "id": "flask-36af821edf",
      "files": [
        "src/flask/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "flask-b78b5a210b",
      "files": [
        "src/flask/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "flask-d0bf462866",
      "files": [
        ".github/workflows/publish.yaml"
      ],
      "outcome": "match"
    },
    {
      "id": "flask-ed5b240417",
      "files": [
        "docs/config.rst",
        "src/flask/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "flask-f976d5bb88",
      "files": [
        "src/flask/__init__.py"
      ],
      "outcome": "match"
    },
    {
      "id": "click-2608132a84",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "faithful"
    },
    {
      "id": "click-3f5eea3438",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "faithful"
    },
    {
      "id": "click-49164faca6",
      "files": [
        "setup.cfg",
        "tox.ini"
      ],
      "outcome": "faithful"
    },
    {
      "id": "click-6b1278f4d4",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "faithful"
    },
    {
      "id": "click-a8910b382d",
      "files": [
        "CHANGES.rst",
        "src/click/__init__.py"
      ],
      "outcome": "faithful"
    },
    {
      "id": "click-b72256a7a6",
      "files": [
        "docs/index.rst"
      ],
      "outcome": "faithful"
    },
    {
      "id": "click-c1d0729bbb",
      "files": [
        "CHANGES.rst",
        "src/click/__init__.py"
      ],
      "outcome": "faithful"
    },
    {
      "id": "flask-7a2d5fb6df",
      "files": [
        "src/flask/blueprints.py",
        "src/flask/scaffold.py",
        "src/flask/typing.py"
      ],
      "outcome": "faithful"
    },
    {
      "id": "flask-cfa863c357",
      "files": [
        "requirements/tests-pallets-min.txt",
        "requirements/tests.txt"
      ],
      "outcome": "faithful"
    },
    {
      "id": "click-0c85d80b07",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-11f48e2cd1",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-19da7c1a80",
      "files": [
        ".github/workflows/tests.yaml"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-2c6e0eb9aa",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-a931cfd59a",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-cba52fa761",
      "files": [
        "CHANGES.rst",
        "src/click/__init__.py"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-cbc676549e",
      "files": [
        "src/click/shell_completion.py"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-d79f0fb61c",
      "files": [
        "docs/advanced.rst"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-dc8e539775",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-e11a1efc33",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "partial"
    },
    {
      "id": "click-fe3677f856",
      "files": [
        "CHANGES.rst"
      ],
      "outcome": "partial"
    },
    {
      "id": "flask-153433f612",
      "files": [
        "src/flask/__init__.py"
      ],
      "outcome": "partial"
    },
    {
      "id": "flask-73739a29f4",
      "files": [
        ".github/workflows/tests.yaml",
        "src/flask/__init__.py"
      ],
      "outcome": "partial"
    },
    {
      "id": "flask-cb4f742543",
      "files": [
        "CHANGES.rst",
        "src/flask/__init__.py"
      ],
      "outcome": "partial"
    }
  ]
};
